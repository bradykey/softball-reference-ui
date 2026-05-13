<template>
  <v-data-table
    :headers="headers"
    :items="games"
    class="elevation-1"
    v-model:sort-by="sortBy"
    must-sort
    :items-per-page="-1"
    :multi-sort="false"
    hide-default-footer
    fixed-header
    density="compact"
    mobile-breakpoint="0"
  >
    <template v-slot:item.opponent="{ item }">
      <router-link
        :to="{ name: 'GameSummary', params: { gameId: item.gameId } }"
      >
        {{ item.opponent }}
      </router-link>
    </template>

    <template v-slot:item.score="{ item }">
      <v-chip v-if="item.score > item.opponentScore">
        {{ item.score }}
      </v-chip>
      <template v-else>
        {{ item.score }}
      </template>
    </template>

    <template v-slot:item.opponentScore="{ item }">
      <v-chip v-if="item.score < item.opponentScore">
        {{ item.opponentScore }}
      </v-chip>
      <template v-else>
        {{ item.opponentScore }}
      </template>
    </template>
  </v-data-table>
</template>

<script>
import { reactive, toRefs, watch } from 'vue';

export default {
  name: 'GameSummaryTable',
  props: {
    games: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const state = reactive({
      headers: [
        {
          title: 'Date',
          key: 'splitDate',
          class: 'bg-softball_red',
          width: '15%'
        },
        {
          title: 'Time',
          key: 'splitTime',
          class: 'bg-softball_red',
          width: '15%'
        },
        {
          title: '',
          key: 'wasHome',
          class: 'bg-softball_red',
          width: '2%'
        },
        {
          title: 'Opponent',
          key: 'opponent',
          class: 'bg-softball_red',
          width: '150px'
        },
        {
          title: 'W/L',
          key: 'winLoss',
          class: 'bg-softball_red',
          width: '75px'
        },
        {
          title: 'R',
          key: 'score',
          class: 'bg-softball_red',
          width: '5%'
        },
        {
          title: 'RA',
          key: 'opponentScore',
          class: 'bg-softball_red',
          width: '5%'
        },
        {
          title: 'Field',
          key: 'field',
          class: 'bg-softball_red',
          width: '20%'
        }
      ],
      sortBy: [{ key: 'splitDate', order: 'desc' }]
    });

    watch(
      () => props.games,
      () => {
        addReadableColumnsToGamesForTable();
      },
      { immediate: true }
    );

    function addReadableColumnsToGamesForTable() {
      props.games.forEach(game => {
        let splitDate = game.date.split(' ');
        game['splitDate'] = splitDate[0];
        game['splitTime'] = splitDate[1];
        game['winLoss'] = game.score > game.opponentScore ? 'W' : 'L';

        game['wasHome'] = game.wasHome ? '' : '@';
      });
    }

    return { ...toRefs(state) };
  }
};
</script>
