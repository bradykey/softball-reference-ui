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
    <v-row justify="end">
      <v-col cols="12" md="4">
        <v-select
          v-if="!Utils.isObjectUndefinedEmptyOrNull(teamLeagues)"
          :items="teamLeagues"
          item-text="league"
          item-value="teamLeagueId"
          v-model="currTeamLeague"
          label="Season"
          outlined
          return-object
        />
      </v-col>
    </v-row>

    <StatLineTable
      v-if="!Utils.isObjectUndefinedEmptyOrNull(seasonSummary)"
      :statLines="seasonSummary.players"
      :accumulatedStats="seasonSummary.accumulated"
    />
  </v-container>
</template>

<script>
import StatLineTable from '@/components/StatLineTable.vue';
import TitleCard from '@/components/TitleCard.vue';
import ApiService from '@/services/ApiService';
import CustomColors from '@/plugins/vuetify/theme.js';
import { computed, reactive, toRefs, watch } from '@vue/composition-api';
import * as Utils from '@/utils/utils.js';

export default {
  name: 'TeamLeagueSummary',
  props: {
    teamName: {
      type: String,
      required: true
    }
  },
  components: {
    TitleCard,
    StatLineTable
  },
  setup(props) {
    const state = reactive({
      /*
       * This are the fetched ATs we got from querying by the parsed team
       * name. Now we don't have to have a route with ids we don't know...
       */
      teamLeagues: null,
      currTeamLeague: null,
      seasonSummary: null
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
          'Win Streak: ' +
          state.seasonSummary.winStreak +
          (state.seasonSummary.winStreak == 1 ? ' game' : ' games')
        );
    });

    const record = computed(() => {
      if (Utils.isObjectUndefinedEmptyOrNull(state.seasonSummary)) return '0-0';
      else return state.seasonSummary.wins + '-' + state.seasonSummary.losses;
    });

    /*
     * Fetch the teamleagues associated with the TeamName in the prop and fill
     * the select dropdown.
     */
    ApiService.getTeamLeaguesByName(
      Utils.formatHypenSpacedWordsToSpaces(props.teamName)
    )
      .then(response => {
        state.teamLeagues = response.data.sort(
          (a, b) => a.teamLeagueId - b.teamLeagueId
        );
        // default the selection to the latest year
        state.currTeamLeague = state.teamLeagues[state.teamLeagues.length - 1];
      })
      .catch(error => console.log(error));

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
        if (!Utils.isObjectUndefinedEmptyOrNull(newCurrTeamLeague))
          // fetch the single season summary
          ApiService.getSeasonSummaryStatLines(
            state.currTeamLeague.teamLeagueId
          )
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

              response.data.players.forEach(player => {
                player.accumulated.statLine['avg'] =
                  player.accumulated.statLine['avg'].toFixed(3);
              });
              response.data.players.forEach(player => {
                player.accumulated.statLine['obp'] =
                  player.accumulated.statLine['obp'].toFixed(3);
              });
              response.data.players.forEach(player => {
                player.accumulated.statLine['slg'] =
                  player.accumulated.statLine['slg'].toFixed(3);
              });
              response.data.players.forEach(player => {
                player.accumulated.statLine['ops'] =
                  player.accumulated.statLine['ops'].toFixed(3);
              });
              state.seasonSummary = response.data;
            })
            .catch(error => {
              // clear the season summary and log the error
              state.seasonSummary = null;
              console.log(error);
            });
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
  }
};
</script>
