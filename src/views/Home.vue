<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-select :items="sortableProps" v-model="sortBy" label="Sort by" />
      </v-col>
      <v-col>
        <v-btn color="primary" class="mr-2" @click="toggleOrder">
          Toggle sort order
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      v-if="summaryStats"
      :headers="headers"
      :items="summaryStats.players"
      :items-per-page="20"
      class="elevation-1"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
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

export default {
  name: 'Home',
  setup() {
    const state = reactive({
      headers: [
        {
          text: 'Player',
          value: 'playerName',
          class: 'softball-red',
          width: '150px'
        },
        {
          text: 'PA',
          value: 'accumulated.statLine.pa',
          class: 'softball-red',
          width: '65px',
          sortable: false
        },
        {
          text: 'AB',
          value: 'accumulated.statLine.ab',
          class: 'softball-red',
          width: '67px'
        },
        {
          text: 'R',
          value: 'accumulated.statLine.r',
          class: 'softball-red',
          width: '65px'
        },
        {
          text: 'H',
          value: 'accumulated.statLine.h',
          class: 'softball-red',
          width: '65px'
        },
        {
          text: '1B',
          value: 'accumulated.statLine.b1',
          class: 'softball-red',
          width: '65px'
        },
        {
          text: '2B',
          value: 'accumulated.statLine.b2',
          class: 'softball-red',
          width: '65px'
        },
        {
          text: '3B',
          value: 'accumulated.statLine.b3',
          class: 'softball-red',
          width: '65px'
        },
        {
          text: 'HR',
          value: 'accumulated.statLine.hr',
          class: 'softball-red',
          width: '67px'
        },
        {
          text: 'RBI',
          value: 'accumulated.statLine.rbi',
          class: 'softball-red',
          width: '70px'
        },
        {
          text: 'BB',
          value: 'accumulated.statLine.bb',
          class: 'softball-red',
          width: '67px'
        },
        {
          text: 'SO',
          value: 'accumulated.statLine.so',
          class: 'softball-red',
          width: '67px'
        },
        {
          text: 'SAC',
          value: 'accumulated.statLine.sac',
          class: 'softball-red',
          width: '75px'
        },
        {
          text: 'FoulOut',
          value: 'accumulated.statLine.fo',
          class: 'softball-red',
          width: '95px'
        },
        {
          text: 'BA',
          value: 'accumulated.statLine.avg',
          class: 'softball-red',
          width: '67px'
        },
        {
          text: 'OBP',
          value: 'accumulated.statLine.obp',
          class: 'softball-red',
          width: '75px'
        },
        {
          text: 'SLG',
          value: 'accumulated.statLine.slg',
          class: 'softball-red',
          width: '75px'
        },
        {
          text: 'OPS',
          value: 'accumulated.statLine.ops',
          class: 'softball-red',
          width: '75px'
        },
        {
          text: 'OBP+',
          value: 'accumulated.obpplus',
          class: 'softball-red',
          width: '85px'
        },
        {
          text: 'SLG+',
          value: 'accumulated.slgplus',
          class: 'softball-red',
          width: '80px'
        },
        {
          text: 'OPS+',
          value: 'accumulated.opsplus',
          class: 'softball-red',
          width: '80px'
        }
      ],
      summaryStats: null,
      sortableProps: [
        { text: 'PA', value: 'accumulated.statLine.pa' },
        { text: 'AB', value: 'accumulated.statLine.ab' },
        { text: 'OBP', value: 'accumulated.statLine.obp' }
      ],
      sortBy: 'accumulated.statLine.pa',
      sortDesc: true
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
        console.log('Sorting By: ' + state.sortBy);
      },
      { immediate: true }
    );

    function toggleOrder() {
      state.sortDesc = !state.sortDesc;
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

    return { ...toRefs(state), toggleOrder };
  }
};
</script>
<style>
.softball-red {
  background-color: #cf2036 !important;
  border-color: #cf2036 !important;
}
</style>
