<template>
  <v-container style="max-width: 720px">
    <v-row align="center" class="mb-2">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Add Game</h1>
        <p class="text-medium-emphasis mb-0">
          Choose a team and season to add a game to.
        </p>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="text" :to="{ name: 'AdminHome' }">Back</v-btn>
      </v-col>
    </v-row>

    <v-form ref="formRef" @submit.prevent="onSubmit">
      <v-select
        v-model="selectedTeam"
        :items="teams"
        item-title="name"
        item-value="name"
        label="Team"
        variant="outlined"
        :rules="[v => !!v || 'Team is required']"
        return-object
        required
      />

      <v-select
        v-model="selectedTeamLeague"
        :items="teamLeagues"
        item-title="league"
        item-value="teamLeagueId"
        label="Season"
        variant="outlined"
        :disabled="!selectedTeam || loadingLeagues"
        :loading="loadingLeagues"
        :rules="[v => !!v || 'Season is required']"
        return-object
        required
      />

      <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
        {{ error }}
      </v-alert>

      <v-btn
        type="submit"
        color="softball_red"
        variant="flat"
        size="large"
        :disabled="!selectedTeamLeague"
      >
        Continue
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { reactive, ref, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';
import ApiService from '@/services/ApiService';
import * as LoadingBar from '@/composables/useLoadingBar';

export default {
  name: 'AddGamePicker',
  setup() {
    const router = useRouter();
    const formRef = ref(null);
    const state = reactive({
      teams: [],
      teamLeagues: [],
      selectedTeam: null,
      selectedTeamLeague: null,
      loadingLeagues: false,
      error: ''
    });

    LoadingBar.turnOnLoadingBar();
    ApiService.getTeams()
      .then(response => {
        state.teams = [...response.data].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      })
      .catch(err => {
        state.error = 'Failed to load teams: ' + (err.message || String(err));
      })
      .finally(() => {
        LoadingBar.turnOffLoadingBar();
      });

    watch(
      () => state.selectedTeam,
      newTeam => {
        state.selectedTeamLeague = null;
        state.teamLeagues = [];
        if (!newTeam) return;

        state.loadingLeagues = true;
        LoadingBar.turnOnLoadingBar();
        ApiService.getTeamLeaguesByTeam(newTeam.name)
          .then(response => {
            state.teamLeagues = [...response.data].sort(
              (a, b) => b.teamLeagueId - a.teamLeagueId
            );
          })
          .catch(err => {
            state.error =
              'Failed to load seasons: ' + (err.message || String(err));
          })
          .finally(() => {
            state.loadingLeagues = false;
            LoadingBar.turnOffLoadingBar();
          });
      }
    );

    async function onSubmit() {
      state.error = '';
      const { valid } = await formRef.value.validate();
      if (!valid) return;

      router.push({
        name: 'AddGame',
        params: { teamLeagueId: state.selectedTeamLeague.teamLeagueId }
      });
    }

    return { ...toRefs(state), formRef, onSubmit };
  }
};
</script>
