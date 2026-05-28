<template>
  <v-container v-if="!Utils.isObjectUndefinedEmptyOrNull(teamLeagues)">
    <v-row align="center">
      <v-col>
        <TitleCard
          :title="team"
          :subtitle="recordSummarySubtitle"
          :titleChipText="record"
          :titleChipColor="CustomColors.softball_red"
          :divider="true"
        />
      </v-col>
      <v-col v-if="isAuthenticated && currTeamLeague" cols="auto">
        <v-btn
          color="softball_red"
          variant="flat"
          prepend-icon="mdi-plus"
          :to="{
            name: 'AddGame',
            params: { teamLeagueId: currTeamLeague.teamLeagueId }
          }"
        >
          Add Game
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4" class="pb-0 mb-0">
        <v-select
          v-if="!Utils.isObjectUndefinedEmptyOrNull(teamLeagues)"
          :items="teamLeagues"
          item-title="league"
          item-value="teamLeagueId"
          v-model="currTeamLeague"
          label="Season"
          variant="outlined"
          return-object
        />
      </v-col>
      <v-col cols="12" md="8" class="pt-0 mt-0 mb-3 pt-md-3 mb-md-0">
        <v-tabs
          v-model="selectedTab"
          background-color="transparent"
          color="softball_yellow"
        >
          <v-tab value="season">Season</v-tab>
          <v-tab value="games">Games</v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <v-window v-model="selectedTab" :touch="false">
      <v-window-item value="season">
        <v-row>
          <v-col cols="12">
            <StatLineTable
              v-if="!Utils.isObjectUndefinedEmptyOrNull(seasonSummary)"
              :statLines="
                seasonSummary.players.map(p => Utils.flattenObject(p))
              "
              :accumulatedStats="seasonSummary.accumulated.statLine"
              :isSeasonSummary="true"
            />
          </v-col>
        </v-row>
      </v-window-item>

      <v-window-item value="games">
        <v-row>
          <v-col cols="12">
            <GameSummaryTable
              v-if="!Utils.isObjectUndefinedEmptyOrNull(games)"
              :games="games.map(g => Utils.flattenObject(g))"
            />
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script>
import GameSummaryTable from '@/components/GameSummaryTable.vue';
import StatLineTable from '@/components/StatLineTable.vue';
import TitleCard from '@/components/TitleCard.vue';
import ApiService from '@/services/ApiService';
import CustomColors from '@/plugins/vuetify/theme.js';
import { computed, reactive, toRefs, watch } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { useStore } from 'vuex';
import * as Utils from '@/utils/utils.js';
import * as LoadingBar from '@/composables/useLoadingBar';

export default {
  name: 'TeamLeagueSummary',
  props: {
    teamName: {
      type: String,
      required: true
    },
    teamLeague: {
      type: String,
      default: null
    }
  },
  components: {
    TitleCard,
    StatLineTable,
    GameSummaryTable
  },
  setup(props) {
    const store = useStore();
    const isAuthenticated = computed(() => store.getters.isAuthenticated);

    const state = reactive({
      teamLeagues: null,
      currTeamLeague: null,
      seasonSummary: null,
      games: null,
      selectedTab: null
    });

    const team = computed(() => {
      if (Utils.isObjectUndefinedEmptyOrNull(state.teamLeagues)) return '';
      else return state.teamLeagues[0].team;
    });

    const recordSummarySubtitle = computed(() => {
      if (Utils.isObjectUndefinedEmptyOrNull(state.seasonSummary)) return '';
      else
        return (
          'Home: ' +
          state.seasonSummary.homeWins +
          '-' +
          state.seasonSummary.homeLosses +
          ' | ' +
          'Away: ' +
          state.seasonSummary.awayWins +
          '-' +
          state.seasonSummary.awayLosses +
          ' | ' +
          'Run Diff: ' +
          (state.seasonSummary.runs > state.seasonSummary.runsAllowed
            ? '+'
            : '') +
          (state.seasonSummary.runs - state.seasonSummary.runsAllowed) +
          ' | ' +
          'Strk: ' +
          (state.seasonSummary.winStreak > state.seasonSummary.lossStreak
            ? 'W' + state.seasonSummary.winStreak
            : 'L' + state.seasonSummary.lossStreak)
        );
    });

    const record = computed(() => {
      if (Utils.isObjectUndefinedEmptyOrNull(state.seasonSummary)) return '0-0';
      else return state.seasonSummary.wins + '-' + state.seasonSummary.losses;
    });

    LoadingBar.turnOnLoadingBar();
    ApiService.getTeamLeaguesByTeam(props.teamName)
      .then(response => {
        state.teamLeagues = response.data;
        if (Utils.isObjectUndefinedEmptyOrNull(props.teamLeague)) {
          state.teamLeagues.sort((a, b) => b.teamLeagueId - a.teamLeagueId);
          state.currTeamLeague = state.teamLeagues[0];
        } else {
          state.currTeamLeague = state.teamLeagues.find(
            tL => (tL.league = props.teamLeague)
          );
        }
      })
      .catch(error => console.log(error))
      .finally(() => {
        LoadingBar.turnOffLoadingBar();
      });

    watch(
      () => state.currTeamLeague,
      newCurrTeamLeague => {
        LoadingBar.turnOnLoadingBar();
        if (!Utils.isObjectUndefinedEmptyOrNull(newCurrTeamLeague)) {
          ApiService.getSeasonSummaryStatLines(newCurrTeamLeague.teamLeagueId)
            .then(response => {
              response.data.accumulated.statLine['avg'] =
                response.data.accumulated.statLine['avg'].toFixed(3);

              response.data.accumulated.statLine['obp'] =
                response.data.accumulated.statLine['obp'].toFixed(3);

              response.data.accumulated.statLine['slg'] =
                response.data.accumulated.statLine['slg'].toFixed(3);

              response.data.accumulated.statLine['ops'] =
                response.data.accumulated.statLine['ops'].toFixed(3);

              response.data.players.forEach(player => {
                if (player.accumulated.statLine['pa'] > 0) {
                  player.accumulated.statLine['avg'] =
                    player.accumulated.statLine['avg'].toFixed(3);
                  player.accumulated.statLine['obp'] =
                    player.accumulated.statLine['obp'].toFixed(3);
                  player.accumulated.statLine['slg'] =
                    player.accumulated.statLine['slg'].toFixed(3);
                  player.accumulated.statLine['ops'] =
                    player.accumulated.statLine['ops'].toFixed(3);
                }
              });
              state.seasonSummary = response.data;
            })
            .catch(error => {
              state.seasonSummary = null;
              console.log(error);
            })
            .finally(() => {
              LoadingBar.turnOffLoadingBar();
            });

          ApiService.getGamesByTeamLeagueId(newCurrTeamLeague.teamLeagueId)
            .then(response => {
              state.games = response.data;
            })
            .catch(error => console.log(error))
            .finally(() => {
              LoadingBar.turnOffLoadingBar();
            });
        }
      },
      { immediate: true }
    );

    onBeforeRouteLeave((to, from) => {
      // right before you leave, make sure to add the currently selected teamleague to the query param
      if (state.currTeamLeague) {
        from.query.teamLeague = state.currTeamLeague.league;
      }
    });

    return {
      ...toRefs(state),
      team,
      recordSummarySubtitle,
      record,
      isAuthenticated,
      CustomColors,
      Utils
    };
  }
};
</script>
