<template>
  <v-data-table
    :headers="headers"
    :items="statLines"
    class="elevation-1"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    @update:sort-by="customInitialSortDirection"
    must-sort
    disable-pagination
    :multi-sort="false"
    hide-default-footer
    fixed-header
    dense
    mobile-breakpoint="0"
  >
    <!-- Create a "sum" row that doesn't get sorted into the main logic of the
    table. We can get access to the headers of the main table through the
    deconstructed slot prop object, but we'll need to build the row and columns
    (tr and tds) manually. -->
    <template v-slot:body.append="{ headers }">
      <tr class="softball_grey font-weight-bold">
        <td v-for="(header, i) in headers" :key="i">
          <div v-if="header.text == 'Player'"></div>

          <div v-else-if="header.text == 'PA'">
            {{ accumulatedStats.statLine.pa }}
          </div>

          <div v-else-if="header.text == 'AB'">
            {{ accumulatedStats.statLine.ab }}
          </div>

          <div v-else-if="header.text == 'R'">
            {{ accumulatedStats.statLine.r }}
          </div>

          <div v-else-if="header.text == 'H'">
            {{ accumulatedStats.statLine.h }}
          </div>

          <div v-else-if="header.text == '1B'">
            {{ accumulatedStats.statLine.b1 }}
          </div>

          <div v-else-if="header.text == '2B'">
            {{ accumulatedStats.statLine.b2 }}
          </div>

          <div v-else-if="header.text == '3B'">
            {{ accumulatedStats.statLine.b3 }}
          </div>

          <div v-else-if="header.text == 'HR'">
            {{ accumulatedStats.statLine.hr }}
          </div>

          <div v-else-if="header.text == 'RBI'">
            {{ accumulatedStats.statLine.rbi }}
          </div>

          <div v-else-if="header.text == 'BB'">
            {{ accumulatedStats.statLine.bb }}
          </div>

          <div v-else-if="header.text == 'SO'">
            {{ accumulatedStats.statLine.so }}
          </div>

          <div v-else-if="header.text == 'SAC'">
            {{ accumulatedStats.statLine.sac }}
          </div>

          <div v-else-if="header.text == 'FoulOut'">
            {{ accumulatedStats.statLine.fo }}
          </div>

          <div v-else-if="header.text == 'GIDP'">
            {{ accumulatedStats.statLine.gidp }}
          </div>

          <div v-else-if="header.text == 'BA'">
            {{ accumulatedStats.statLine.avg }}
          </div>

          <div v-else-if="header.text == 'OBP'">
            {{ accumulatedStats.statLine.obp }}
          </div>

          <div v-else-if="header.text == 'SLG'">
            {{ accumulatedStats.statLine.slg }}
          </div>

          <div v-else-if="header.text == 'OPS'">
            {{ accumulatedStats.statLine.ops }}
          </div>

          <div v-else>--</div>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api';
import * as Utils from '@/utils/utils';

export default {
  name: 'Home',
  props: {
    /**
     * The collection of statlines that will make up the table.
     */
    statLines: {
      type: Array,
      required: true
    },
    /**
     * The stats to fill the "sum" row at the bottom of the table. That is, if
     * all the rows were summed in the column, this row should contain that
     * value.
     */
    accumulatedStats: {
      type: Object,
      required: true
    }
  },
  setup() {
    const state = reactive({
      headers: [
        {
          text: 'Player',
          value: 'accumulated.statLine.playerName',
          class: 'softball_red',
          width: '150px',
          sortDescFirst: false
        },
        {
          text: 'PA',
          value: 'accumulated.statLine.pa',
          class: 'softball_red',
          width: '65px',
          sortDescFirst: true
        },
        {
          text: 'AB',
          value: 'accumulated.statLine.ab',
          class: 'softball_red',
          width: '67px',
          sortDescFirst: true
        },
        {
          text: 'R',
          value: 'accumulated.statLine.r',
          class: 'softball_red',
          width: '65px',
          sortDescFirst: true
        },
        {
          text: 'H',
          value: 'accumulated.statLine.h',
          class: 'softball_red',
          width: '65px',
          sortDescFirst: true
        },
        {
          text: '1B',
          value: 'accumulated.statLine.b1',
          class: 'softball_red',
          width: '65px',
          sortDescFirst: true
        },
        {
          text: '2B',
          value: 'accumulated.statLine.b2',
          class: 'softball_red',
          width: '65px',
          sortDescFirst: true
        },
        {
          text: '3B',
          value: 'accumulated.statLine.b3',
          class: 'softball_red',
          width: '65px',
          sortDescFirst: true
        },
        {
          text: 'HR',
          value: 'accumulated.statLine.hr',
          class: 'softball_red',
          width: '67px',
          sortDescFirst: true
        },
        {
          text: 'RBI',
          value: 'accumulated.statLine.rbi',
          class: 'softball_red',
          width: '70px',
          sortDescFirst: true
        },
        {
          text: 'BB',
          value: 'accumulated.statLine.bb',
          class: 'softball_red',
          width: '67px',
          sortDescFirst: true
        },
        {
          text: 'SO',
          value: 'accumulated.statLine.so',
          class: 'softball_red',
          width: '67px',
          sortDescFirst: false
        },
        {
          text: 'SAC',
          value: 'accumulated.statLine.sac',
          class: 'softball_red',
          width: '75px',
          sortDescFirst: true
        },
        {
          text: 'FoulOut',
          value: 'accumulated.statLine.fo',
          class: 'softball_red',
          width: '95px',
          sortDescFirst: false
        },
        {
          text: 'GIDP',
          value: 'accumulated.statLine.gidp',
          class: 'softball_red',
          width: '95px',
          sortDescFirst: false
        },
        {
          text: 'BA',
          value: 'accumulated.statLine.avg',
          class: 'softball_red',
          width: '67px',
          sortDescFirst: true
        },
        {
          text: 'OBP',
          value: 'accumulated.statLine.obp',
          class: 'softball_red',
          width: '75px',
          sortDescFirst: true
        },
        {
          text: 'SLG',
          value: 'accumulated.statLine.slg',
          class: 'softball_red',
          width: '75px',
          sortDescFirst: true
        },
        {
          text: 'OPS',
          value: 'accumulated.statLine.ops',
          class: 'softball_red',
          width: '75px',
          sortDescFirst: true
        },
        {
          text: 'OBP+',
          value: 'accumulated.obpplus',
          class: 'softball_red',
          width: '85px',
          sortDescFirst: true
        },
        {
          text: 'SLG+',
          value: 'accumulated.slgplus',
          class: 'softball_red',
          width: '80px',
          sortDescFirst: true
        },
        {
          text: 'OPS+',
          value: 'accumulated.opsplus',
          class: 'softball_red',
          width: '80px',
          sortDescFirst: true
        }
      ],
      sortBy: 'accumulated.statLine.playerName',
      sortDesc: false
    });

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

    return { ...toRefs(state), customInitialSortDirection };
  }
};
</script>
