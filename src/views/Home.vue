<template>
  <v-container>
    <v-data-table
      v-if="summaryStats"
      :headers="headers"
      :items="summaryStats.players"
      :items-per-page="20"
      class="elevation-1"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      @update:sort-by="customInitialSortDirection"
      must-sort
      :multi-sort="false"
      hide-default-footer
      fixed-header
      dense
      mobile-breakpoint="0"
    ></v-data-table>
  </v-container>
</template>

<script>
import ApiService from '@/services/ApiService';
import { reactive, toRefs, watch } from '@vue/composition-api';
import * as Utils from '@/utils/utils';

export default {
  name: 'Home',
  setup() {
    const state = reactive({
      headers: [
        {
          text: 'Player',
          value: 'playerName',
          class: 'softball-red',
          width: '150px',
          sortDescFirst: false
        },
        {
          text: 'PA',
          value: 'accumulated.statLine.pa',
          class: 'softball-red',
          width: '65px',
          sortDescFirst: true
        },
        {
          text: 'AB',
          value: 'accumulated.statLine.ab',
          class: 'softball-red',
          width: '67px',
          sortDescFirst: true
        },
        {
          text: 'R',
          value: 'accumulated.statLine.r',
          class: 'softball-red',
          width: '65px',
          sortDescFirst: true
        },
        {
          text: 'H',
          value: 'accumulated.statLine.h',
          class: 'softball-red',
          width: '65px',
          sortDescFirst: true
        },
        {
          text: '1B',
          value: 'accumulated.statLine.b1',
          class: 'softball-red',
          width: '65px',
          sortDescFirst: true
        },
        {
          text: '2B',
          value: 'accumulated.statLine.b2',
          class: 'softball-red',
          width: '65px',
          sortDescFirst: true
        },
        {
          text: '3B',
          value: 'accumulated.statLine.b3',
          class: 'softball-red',
          width: '65px',
          sortDescFirst: true
        },
        {
          text: 'HR',
          value: 'accumulated.statLine.hr',
          class: 'softball-red',
          width: '67px',
          sortDescFirst: true
        },
        {
          text: 'RBI',
          value: 'accumulated.statLine.rbi',
          class: 'softball-red',
          width: '70px',
          sortDescFirst: true
        },
        {
          text: 'BB',
          value: 'accumulated.statLine.bb',
          class: 'softball-red',
          width: '67px',
          sortDescFirst: true
        },
        {
          text: 'SO',
          value: 'accumulated.statLine.so',
          class: 'softball-red',
          width: '67px',
          sortDescFirst: false
        },
        {
          text: 'SAC',
          value: 'accumulated.statLine.sac',
          class: 'softball-red',
          width: '75px',
          sortDescFirst: true
        },
        {
          text: 'FoulOut',
          value: 'accumulated.statLine.fo',
          class: 'softball-red',
          width: '95px',
          sortDescFirst: false
        },
        {
          text: 'GIDP',
          value: 'accumulated.statLine.gidp',
          class: 'softball-red',
          width: '95px',
          sortDescFirst: false
        },
        {
          text: 'BA',
          value: 'accumulated.statLine.avg',
          class: 'softball-red',
          width: '67px',
          sortDescFirst: true
        },
        {
          text: 'OBP',
          value: 'accumulated.statLine.obp',
          class: 'softball-red',
          width: '75px',
          sortDescFirst: true
        },
        {
          text: 'SLG',
          value: 'accumulated.statLine.slg',
          class: 'softball-red',
          width: '75px',
          sortDescFirst: true
        },
        {
          text: 'OPS',
          value: 'accumulated.statLine.ops',
          class: 'softball-red',
          width: '75px',
          sortDescFirst: true
        },
        {
          text: 'OBP+',
          value: 'accumulated.obpplus',
          class: 'softball-red',
          width: '85px',
          sortDescFirst: true
        },
        {
          text: 'SLG+',
          value: 'accumulated.slgplus',
          class: 'softball-red',
          width: '80px',
          sortDescFirst: true
        },
        {
          text: 'OPS+',
          value: 'accumulated.opsplus',
          class: 'softball-red',
          width: '80px',
          sortDescFirst: true
        }
      ],
      summaryStats: null,
      sortBy: 'playerName',
      sortDesc: false
    });

    /*
     * The state reactive object is reactive as a whole, but each property is
     * not reactive on its on. We need to adjust the watch signature (by having
     * it take an annonymous function that returns the state.sortDescending)
     * since watch methods must watch ref objects. I could also just have this
     * property be defined as its own const that is a ref...
     *
     * const sortDescending = ref(true);
     */
    watch(
      () => state.sortBy,
      () => {
        //console.log('Sorting By: ' + state.sortBy);
      },
      { immediate: true }
    );

    /**
     * By default, columns that are sorted using the built in "click-on-header"
     * functionality of the v-data-table sort ascending first, and then
     * descending. Since we want the numbered stats to sort descending first (so
     * we see who has the highest PAs, BA, etc.) we have to handle the override
     * of the sortDesc property.
     *
     * NOTE: We need to have must-sort turned on for the table otherwise,
     * sometimes the payload of this event is an array of size one, and
     * sometimes it's a string. Weird. must-sort keeps the "reset" functionality
     * turned off. That is, it either is sorting ascending or descending of the
     * column you clicked. In other words, there are two toggleable options, not
     * three (the third being none sort).
     *
     * @param {String} nameOfColumnToSortBy this is the column that was selected
     * to sort by in the table
     */
    function customInitialSortDirection(nameOfColumnToSortBy) {
      let headerToSortBy = state.headers.find(
        h => h.value === nameOfColumnToSortBy
      );

      if (
        !Utils.isObjectUndefinedEmptyOrNull(headerToSortBy) &&
        headerToSortBy.sortDescFirst
      ) {
        /*
         * Since this is called on the update of the sort-by property, this method
         * will get called at the BEGINNING of that event. That is, before it's
         * actually changed. So therefore, if we set the bound state.sortDesc
         * property in here to true, it would immediately get overridden by
         * whatever would have come back from the action of clicking on the
         * header. Instead, if we use nextTick(), and set the value of the
         * property in the callback, it'll be done after the DOM update and
         * actually override the sortDesc, which is what we wanted.
         */
        this.$nextTick(() => {
          state.sortDesc = true;
        });
      }
    }

    // fetch the single season summary
    ApiService.getSeasonSummaryStatLines(9)
      .then(response => {
        // convert the aggregate columns to 3 decimal places
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
        state.summaryStats = response.data;
      })
      .catch(error => console.log(error));

    return { ...toRefs(state), customInitialSortDirection };
  }
};
</script>
<style>
.softball-red {
  background-color: #cf2036 !important;
  border-color: #cf2036 !important;
}
</style>
