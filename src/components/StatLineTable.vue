<template>
  <v-data-table
    :headers="headers"
    :items="statLines"
    :class="isSeasonSummary ? 'sticky1' : 'sticky2'"
    v-model:sort-by="sortBy"
    @update:sort-by="customInitialSortDirection"
    must-sort
    :items-per-page="-1"
    :multi-sort="false"
    hide-default-footer
    fixed-header
    density="compact"
    no-data-text="Stats weren't captured for this game"
    mobile-breakpoint="0"
  >
    <!-- Create a "sum" row that doesn't get sorted into the main logic of the
    table. We can get access to the headers of the main table through the
    deconstructed slot prop object, but we'll need to build the row and columns
    (tr and tds) manually. -->
    <template v-slot:body.append="{ columns }">
      <tr class="bg-softball_grey font-weight-bold">
        <td v-for="(column, i) in columns" :key="i">
          <div v-if="column.title === 'Player'">Team Totals</div>
          <div v-else-if="column.title === 'PA'">{{ accumulatedStats.pa }}</div>
          <div v-else-if="column.title === 'AB'">{{ accumulatedStats.ab }}</div>
          <div v-else-if="column.title === 'H'">{{ accumulatedStats.h }}</div>
          <div v-else-if="column.title === 'R'">{{ accumulatedStats.r }}</div>
          <div v-else-if="column.title === '1B'">
            {{ accumulatedStats.b1 }}
          </div>
          <div v-else-if="column.title === '2B'">
            {{ accumulatedStats.b2 }}
          </div>
          <div v-else-if="column.title === '3B'">
            {{ accumulatedStats.b3 }}
          </div>
          <div v-else-if="column.title === 'HR'">
            {{ accumulatedStats.hr }}
          </div>
          <div v-else-if="column.title === 'RBI'">
            {{ accumulatedStats.rbi }}
          </div>
          <div v-else-if="column.title === 'BB'">
            {{ accumulatedStats.bb }}
          </div>
          <div v-else-if="column.title === 'SO'">
            {{ accumulatedStats.so }}
          </div>
          <div v-else-if="column.title === 'SAC'">
            {{ accumulatedStats.sac }}
          </div>
          <div v-else-if="column.title === 'FoulOut'">
            {{ accumulatedStats.fo }}
          </div>
          <div v-else-if="column.title === 'HR4O'">
            {{ accumulatedStats.hr4O }}
          </div>
          <div v-else-if="column.title === 'GIDP'">
            {{ accumulatedStats.gidp }}
          </div>
          <div v-else-if="column.title === 'BA'">
            {{ accumulatedStats.avg }}
          </div>
          <div v-else-if="column.title === 'OBP'">
            {{ accumulatedStats.obp }}
          </div>
          <div v-else-if="column.title === 'SLG'">
            {{ accumulatedStats.slg }}
          </div>
          <div v-else-if="column.title === 'OPS'">
            {{ accumulatedStats.ops }}
          </div>
          <div v-else>--</div>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import { nextTick, reactive, toRefs } from 'vue';
import * as Utils from '@/utils/utils';
import * as Constants from '@/utils/constants';

export default {
  name: 'StatLineTable',
  props: {
    statLines: {
      type: Array,
      required: true
    },
    accumulatedStats: {
      type: Object,
      required: true
    },
    isSeasonSummary: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const state = reactive({
      headers: [
        {
          title: 'Player',
          key: 'playerName',
          class: 'bg-softball_red',
          cellProps: { class: 'text-no-wrap' },
          width: '150px',
          sortDescFirst: false
        },
        ...Constants.baseStatsHeaders
      ],
      sortBy: [{ key: 'playerName', order: 'asc' }]
    });

    if (props.isSeasonSummary) {
      state.headers.push(...Constants.plusStatsHeaders);
    } else {
      state.headers.unshift({
        title: '',
        key: 'bo',
        class: 'bg-softball_red',
        width: '65px',
        sortDescFirst: false
      });
      state.sortBy = [{ key: 'bo', order: 'asc' }];
    }

    /**
     * By default columns sort ascending first. For columns with sortDescFirst,
     * flip the first click to descending. Re-fires with the new value so we
     * avoid an infinite loop by only acting when the order is currently 'asc'.
     */
    function customInitialSortDirection(newSortBy) {
      if (!newSortBy || !newSortBy.length) return;
      const sortItem = newSortBy[0];
      const header = state.headers.find(h => h.key === sortItem.key);

      if (
        !Utils.isObjectUndefinedEmptyOrNull(header) &&
        header.sortDescFirst &&
        sortItem.order === 'asc'
      ) {
        nextTick(() => {
          state.sortBy = [{ key: sortItem.key, order: 'desc' }];
        });
      }
    }

    return { ...toRefs(state), customInitialSortDirection };
  }
};
</script>
<style>
.sticky1 table > tbody > tr > td:nth-child(1),
table > thead > tr > th:nth-child(1) {
  position: sticky !important;
  position: -webkit-sticky !important;
  left: 0;
  z-index: 2;
  background: #1e1e1e;
}
.sticky1 table > thead > tr > th:nth-child(1) {
  z-index: 3 !important;
}

.sticky2 table > tbody > tr > td:nth-child(1),
table > thead > tr > th:nth-child(1) {
  position: sticky !important;
  position: -webkit-sticky !important;
  left: 0;
  z-index: 2;
  background: #1e1e1e;
}
.sticky2 table > thead > tr > th:nth-child(1) {
  z-index: 3 !important;
}
.sticky2 table > tbody > tr > td:nth-child(2),
table > thead > tr > th:nth-child(2) {
  position: sticky !important;
  position: -webkit-sticky !important;
  left: 0;
  z-index: 2;
  background: #1e1e1e;
}
.sticky2 table > thead > tr > th:nth-child(2) {
  z-index: 3 !important;
}
</style>
