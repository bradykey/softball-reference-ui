<template>
  <v-container v-if="!Utils.isObjectUndefinedEmptyOrNull(game)">
    <!-- <router-link :to="{ path: $store.state.route.from.fullPath }">
      Back
    </router-link> -->
    <v-row>
      <v-col>
        <TitleCard
          :title="gameTitle"
          :subtitle="gameSummarySubtitle"
          :titleChipText="score"
          :outlinedChip="!Utils.didWin(game.score, game.opponentScore)"
          :titleChipColor="CustomColors.softball_red"
          :divider="true"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <StatLineTable
          v-if="!Utils.isObjectUndefinedEmptyOrNull(game)"
          :statLines="game.statLines"
          :accumulatedStats="game.accumulated.statLine"
          :isSeasonSummary="false"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import StatLineTable from '@/components/StatLineTable.vue';
import TitleCard from '@/components/TitleCard.vue';
import ApiService from '@/services/ApiService';
import CustomColors from '@/plugins/vuetify/theme.js';
import { computed, reactive, toRefs } from '@vue/composition-api';
import * as Utils from '@/utils/utils.js';
import * as LoadingBar from '@/composables/useLoadingBar';

export default {
  name: 'GameSummary',
  props: {
    gameId: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    TitleCard,
    StatLineTable
  },
  setup(props) {
    const state = reactive({
      game: null,
      prevRoute: null
    });

    const gameTitle = computed(() => {
      if (Utils.isObjectUndefinedEmptyOrNull(state.game)) return '';
      else return (state.game.wasHome ? 'vs ' : '@ ') + state.game.opponent;
    });

    const score = computed(() => {
      if (Utils.isObjectUndefinedEmptyOrNull(state.game)) return '0-0';
      else
        return (
          state.game.score +
          '-' +
          state.game.opponentScore +
          ' (' +
          (Utils.didWin(state.game.score, state.game.opponentScore)
            ? 'W'
            : 'L') +
          ')'
        );
    });

    const gameSummarySubtitle = computed(() => {
      if (Utils.isObjectUndefinedEmptyOrNull(state.game)) return '';
      else {
        let splitDate = state.game.date.split(' ');
        return (
          'Date: ' +
          splitDate[0] +
          ' | ' +
          'Time: ' +
          splitDate[1] +
          ' | ' +
          'Field: ' +
          state.game.field
        );
      }
    });

    LoadingBar.turnOnLoadingBar();
    /*
     * Fetch the games associated with the GameId in the prop
     */
    ApiService.getGameById(props.gameId)
      .then(response => {
        // only try to do this if there are stats captured for this game...
        if (response.data.statLines.length > 0) {
          // convert the aggregate columns to 3 decimal places
          response.data.accumulated.statLine['avg'] =
            response.data.accumulated.statLine['avg'].toFixed(3);

          response.data.accumulated.statLine['obp'] =
            response.data.accumulated.statLine['obp'].toFixed(3);

          response.data.accumulated.statLine['slg'] =
            response.data.accumulated.statLine['slg'].toFixed(3);

          response.data.accumulated.statLine['ops'] =
            response.data.accumulated.statLine['ops'].toFixed(3);
        }

        response.data.statLines.forEach(sL => {
          sL['avg'] = sL['avg'].toFixed(3);
          sL['obp'] = sL['obp'].toFixed(3);
          sL['slg'] = sL['slg'].toFixed(3);
          sL['ops'] = sL['ops'].toFixed(3);
        });

        state.game = response.data;
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        LoadingBar.turnOffLoadingBar();
      });

    return {
      ...toRefs(state),
      gameTitle,
      gameSummarySubtitle,
      score,
      CustomColors,
      Utils
    };
  },
  beforeRouteEnter(to, from, next) {
    // this is a callback to the route so we can get access to the view model once it's been created (i.e. this)
    next(vm => {
      vm.prevRoute = from;
    });
  }
};
</script>
