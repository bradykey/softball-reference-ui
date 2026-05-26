<template>
  <v-container>
    <v-row align="center">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Add Game</h1>
        <p class="text-medium-emphasis">TeamLeague&nbsp;#{{ teamLeagueId }}</p>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="outlined" @click="onLogout">Log out</v-btn>
      </v-col>
    </v-row>

    <v-form ref="formRef" @submit.prevent="onSubmit">
      <v-card class="pa-4 mb-4" color="transparent" elevation="0">
        <v-card-title class="px-0">Game details</v-card-title>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="game.date"
              type="date"
              label="Date"
              variant="outlined"
              :rules="[v => !!v || 'Date is required']"
              required
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="game.time"
              :items="timeOptions"
              item-title="title"
              item-value="value"
              label="Start time"
              variant="outlined"
              :rules="[v => !!v || 'Time is required']"
              required
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="game.opponent"
              label="Opponent"
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="game.field"
              label="Field"
              variant="outlined"
            />
          </v-col>
          <v-col cols="6" md="3">
            <v-switch
              v-model="game.wasHome"
              label="Home game?"
              color="softball_red"
              hide-details
              inset
            />
          </v-col>
          <v-col cols="6" md="3">
            <v-text-field
              v-model.number="game.score"
              type="number"
              min="0"
              label="Our score"
              variant="outlined"
            />
          </v-col>
          <v-col cols="6" md="3">
            <v-text-field
              v-model.number="game.opponentScore"
              type="number"
              min="0"
              label="Opponent score"
              variant="outlined"
            />
          </v-col>
        </v-row>
      </v-card>

      <v-card
        v-if="lineup.length || bench.length"
        class="pa-4 mb-4"
        color="transparent"
        elevation="0"
      >
        <v-card-title class="px-0">Lineup &amp; statlines</v-card-title>
        <p class="text-medium-emphasis mb-3">
          Check a bench player to add them to the lineup. Drag the lineup rows
          to set batting order. Empty stat cells submit as 0; the server
          computes AB, H, AVG, OBP, SLG, OPS.
        </p>
        <StatLineEntryTable v-model:lineup="lineup" v-model:bench="bench" />
      </v-card>

      <v-alert
        v-else-if="!loadingRoster"
        type="warning"
        variant="tonal"
        class="mb-4"
      >
        No players found on this team-league's roster. Add players before
        recording statlines.
      </v-alert>

      <v-alert v-if="errors.length" type="error" variant="tonal" class="mb-4">
        <div v-for="(err, i) in errors" :key="i">{{ err }}</div>
      </v-alert>

      <v-btn
        type="submit"
        color="softball_red"
        variant="flat"
        size="large"
        :loading="submitting"
        :disabled="!lineup.length && !bench.length"
      >
        Save game
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { reactive, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import ApiService from '@/services/ApiService';
import StatLineEntryTable from '@/components/StatLineEntryTable.vue';
import { statLineEntryColumns } from '@/utils/constants';
import { toBackendDateString } from '@/utils/utils';
import * as LoadingBar from '@/composables/useLoadingBar';

export default {
  name: 'AddGame',
  components: { StatLineEntryTable },
  props: {
    teamLeagueId: { type: [String, Number], required: true }
  },
  setup(props) {
    const router = useRouter();
    const store = useStore();
    const formRef = ref(null);

    function onLogout() {
      store.dispatch('logout');
      router.push({ name: 'Login' });
    }
    const timeOptions = [
      { title: '6:30 PM', value: '18:30' },
      { title: '7:30 PM', value: '19:30' },
      { title: '8:30 PM', value: '20:30' }
    ];

    const state = reactive({
      game: {
        date: '',
        time: '',
        opponent: '',
        field: '',
        wasHome: true,
        score: 0,
        opponentScore: 0
      },
      lineup: [],
      bench: [],
      errors: [],
      submitting: false,
      loadingRoster: true
    });

    function blankRow(player) {
      const row = {
        teamLeaguePlayerId: player.teamLeaguePlayerId,
        name: player.name
      };
      statLineEntryColumns.forEach(col => {
        row[col.key] = 0;
      });
      return row;
    }

    LoadingBar.turnOnLoadingBar();
    ApiService.getRoster(props.teamLeagueId)
      .then(response => {
        const sorted = [...response.data].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        state.bench = sorted.map(blankRow);
      })
      .catch(error => {
        console.log(error);
        state.errors = [
          'Failed to load roster: ' + (error.message || String(error))
        ];
      })
      .finally(() => {
        state.loadingRoster = false;
        LoadingBar.turnOffLoadingBar();
      });

    async function onSubmit() {
      state.errors = [];
      const { valid } = await formRef.value.validate();
      if (!valid) return;

      state.submitting = true;
      LoadingBar.turnOnLoadingBar();

      const gamePayload = {
        date: toBackendDateString(`${state.game.date}T${state.game.time}`),
        opponent: state.game.opponent || null,
        score: state.game.score,
        opponentScore: state.game.opponentScore,
        field: state.game.field || null,
        wasHome: state.game.wasHome,
        teamLeagueId: Number(props.teamLeagueId)
      };

      let gameId;
      try {
        const res = await ApiService.createGame(gamePayload);
        gameId = res.data.gameId;
      } catch (error) {
        state.errors = [
          'Failed to create game: ' + (error.message || String(error))
        ];
        state.submitting = false;
        LoadingBar.turnOffLoadingBar();
        return;
      }

      const rowErrors = [];
      for (let i = 0; i < state.lineup.length; i++) {
        const row = state.lineup[i];
        const payload = {
          gameId,
          teamLeaguePlayerId: row.teamLeaguePlayerId,
          bO: i + 1
        };
        statLineEntryColumns.forEach(col => {
          payload[col.postKey] = Number(row[col.key]) || 0;
        });
        try {
          await ApiService.createStatLine(payload);
        } catch (error) {
          rowErrors.push(
            `Statline for ${row.name} failed: ${error.message || String(error)}`
          );
        }
      }

      state.submitting = false;
      LoadingBar.turnOffLoadingBar();

      if (rowErrors.length) {
        state.errors = [
          `Game #${gameId} was created, but some statlines failed:`,
          ...rowErrors
        ];
        return;
      }

      router.push({ name: 'GameSummary', params: { gameId } });
    }

    return { ...toRefs(state), timeOptions, formRef, onSubmit, onLogout };
  }
};
</script>
