<template>
  <v-data-table
    :headers="headers"
    :items="games"
    class="elevation-1"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    must-sort
    disable-pagination
    :multi-sort="false"
    hide-default-footer
    fixed-header
    dense
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
import { reactive, toRefs, watch } from '@vue/composition-api';

export default {
  name: 'GameSummaryTable',
  props: {
    /**
     * The collection of games that will make up the table.
     */
    games: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const state = reactive({
      headers: [
        {
          text: 'Date',
          value: 'splitDate',
          class: 'softball_red',
          width: '15%'
        },
        {
          text: 'Time',
          value: 'splitTime',
          class: 'softball_red',
          width: '15%'
        },
        /*
         * This is a readable column that doesn't map to the object directly
         * from the API, but is dynamically added upon fetch.
         */
        {
          text: '',
          value: 'wasHome',
          class: 'softball_red',
          width: '2%'
        },
        {
          text: 'Opponent',
          value: 'opponent',
          class: 'softball_red',
          width: '150px'
        },
        {
          text: 'W/L',
          value: 'winLoss',
          class: 'softball_red',
          width: '75px'
        },
        {
          text: 'R',
          value: 'score',
          class: 'softball_red',
          width: '5%'
        },
        {
          text: 'RA',
          value: 'opponentScore',
          class: 'softball_red',
          width: '5%'
        },
        {
          text: 'Field',
          value: 'field',
          class: 'softball_red',
          width: '20%'
        }
      ],
      sortBy: 'date',
      sortDesc: true
    });

    /*
     * Any time the games change, I need to massage the readable columns. This
     * is probably overkill to have a watcheron this since I believe the
     * props.games only change onthe initial setof them and therefore this
     * method could just be called once in the setup() or in a mounted()hook or
     * something. However, we *could* do some sort of external minipulation of
     * the props outside of this component, and if we did, we would need to
     * re-run this method.
     */
    watch(
      () => props.games,
      () => {
        addReadableColumnsToGamesForTable();
      },
      { immediate: true }
    );

    /**
     * Shape the bound table data by adding readable columns to the prop passed
     * in.
     */
    function addReadableColumnsToGamesForTable() {
      /*
       * If I wanted to add some readable columns based on combos of other
       * fields, or a different version of the data, I would need to do it here
       * in order for the table header to correctly bind to a legit value in the
       * array. If you did it using a dynamic item slot in the template, things
       * like built-in sorting or filtering wouldn't work since the table bind
       * would have already happened before the value was added in the template
       * slot. Therefore, you just need to create a matching value that the
       * header maps to, even if you're not going to show it as its own column.
       * Whatever is contained in the header's value will be
       * filterable/searchable. (NOTE: you can also use the sortableProps
       * property of the data table to do external sorting. But that's another
       * thing here.)
       *
       * NOTE: JS allows you to dynamically create a named property on each
       * object by just "subbing" into the array with a new property name.
       */
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
