<template>
  <v-container v-if="!Utils.isObjectUndefinedEmptyOrNull(teamLeagues)">
    <v-row>
      <v-col>
        <TitleCard
          :title="team"
          :subtitle="recordSummarySubtitle"
          :titleChipText="record"
          :titleChipColor="CustomColors.softball_red"
          :divider="true"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4" class="pb-0 mb-0">
        <v-select
          v-if="!Utils.isObjectUndefinedEmptyOrNull(teamLeagues)"
          style="z-index: 10000"
          :items="teamLeagues"
          item-text="league"
          item-value="teamLeagueId"
          v-model="currTeamLeague"
          label="Season"
          outlined
          return-object
        />
      </v-col>
      <v-col cols="12" md="8" class="pt-0 mt-0 mb-3 pt-md-3 mb-md-0">
        <v-tabs
          v-model="selectedTab"
          background-color="transparent"
          color="softball_yellow"
        >
          <v-tab key="season">Season</v-tab>
          <v-tab key="games">Games</v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <v-tabs-items v-model="selectedTab" touchless>
      <v-tab-item key="season">
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
      </v-tab-item>

      <v-tab-item key="games">
        <v-row>
          <v-col cols="12">
            <GameSummaryTable
              v-if="!Utils.isObjectUndefinedEmptyOrNull(games)"
              :games="games.map(g => Utils.flattenObject(g))"
            />
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import GameSummaryTable from '@/components/GameSummaryTable.vue';
import StatLineTable from '@/components/StatLineTable.vue';
import TitleCard from '@/components/TitleCard.vue';
import ApiService from '@/services/ApiService';
import CustomColors from '@/plugins/vuetify/theme.js';
import { computed, reactive, toRefs, watch } from '@vue/composition-api';
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
    const state = reactive({
      /*
       * This are the fetched ATs we got from querying by the parsed team
       * name. Now we don't have to have a route with ids we don't know...
       */
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
    /*
     * Fetch the teamleagues associated with the TeamName in the prop and fill
     * the select dropdown.
     */
    ApiService.getTeamLeaguesByTeam(
      Utils.formatHypenSpacedWordsToSpaces(props.teamName)
    )
      .then(response => {
        state.teamLeagues = response.data;
        if (Utils.isObjectUndefinedEmptyOrNull(state.teamLeagues)) {
          // sort in descending order, newest to oldest year
          state.teamLeagues.sort((a, b) => b.teamLeagueId - a.teamLeagueId);
          // default the selection to the latest year
          state.currTeamLeague = state.teamLeagues[0];
        } else {
          // set it to the one that matches the query param
          state.currTeamLeague = state.teamLeagues.find(
            tL => (tL.league = props.teamLeague)
          );
        }
      })
      .catch(error => console.log(error))
      .finally(() => {
        LoadingBar.turnOffLoadingBar();
      });

    /*
     * The state reactive object is reactive as a whole, but each property is
     * not reactive on its on. We need to adjust the watch signature (by having
     * it take an annonymous function that returns the state.currTeamLeagueId)
     * since watch methods must watch ref objects. I could also just have this
     * property be defined as its own const that is a ref...
     *
     * const currTeamLeagueId = ref(true);
     */
    watch(
      () => state.currTeamLeague,
      newCurrTeamLeague => {
        LoadingBar.turnOnLoadingBar();
        if (!Utils.isObjectUndefinedEmptyOrNull(newCurrTeamLeague)) {
          // fetch the single season summary
          ApiService.getSeasonSummaryStatLines(newCurrTeamLeague.teamLeagueId)
            .then(response => {
              // convert the aggregate columns to 3 decimal places
              response.data.accumulated.statLine['avg'] =
                response.data.accumulated.statLine['avg'].toFixed(3);

              response.data.accumulated.statLine['obp'] =
                response.data.accumulated.statLine['obp'].toFixed(3);

              response.data.accumulated.statLine['slg'] =
                response.data.accumulated.statLine['slg'].toFixed(3);

              response.data.accumulated.statLine['ops'] =
                response.data.accumulated.statLine['ops'].toFixed(3);

              // only convert the aggregate columns if the player has had a plate appearance
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
              // clear the season summary and log the error
              state.seasonSummary = null;
              console.log(error);
            })
            .finally(() => {
              LoadingBar.turnOffLoadingBar();
            });

          // fetch the games
          ApiService.getGamesByTeamLeague(newCurrTeamLeague.teamLeagueId)
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

    return {
      ...toRefs(state),
      team,
      recordSummarySubtitle,
      record,
      CustomColors,
      Utils
    };
  },
  beforeRouteLeave(to, from, next) {
    // right before you leave, make sure to add the currently selected teamleague to the query param
    from.query.teamLeague = this.currTeamLeague.league;
    next();
  }
};
</script>
