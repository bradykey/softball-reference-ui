<template>
  <v-container>
    <v-data-table
      v-if="summaryStats"
      :headers="headers"
      :items="summaryStats.players"
      :items-per-page="20"
      class="elevation-1"
      sort-by="playerName"
      hide-default-footer
      fixed-header
      dense
      mobile-breakpoint="0"
    ></v-data-table>
  </v-container>
</template>

<script>
import axios from 'axios';
import { reactive, toRefs } from '@vue/composition-api';

export default {
  name: 'Home',
  setup() {
    const state = reactive({
      headers: [
        { text: 'Player', value: 'playerName', class: 'softball-red' },
        {
          text: 'PA',
          value: 'accumulated.statLine.pa',
          class: 'softball-red',
          width: '65px'
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
      summaryStats: null
    });

    // fetch the single season summary
    axios
      .get('https://softball-reference-api.herokuapp.com/teamleagues/9')
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

    return { ...toRefs(state) };
  }
};
</script>
<style>
.softball-red {
  background-color: #cf2036 !important;
  border-color: #cf2036 !important;
}
</style>
