<template>
  <v-container>
    <v-data-table
      v-if="summaryStats"
      :headers="headers"
      :items="summaryStats.players"
      :items-per-page="20"
      class="elevation-1"
      sort-by="playerName"
      dense
      hide-default-footer
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
        { text: 'Player', value: 'playerName' },
        { text: 'PA', value: 'accumulated.statLine.pa' },
        { text: 'AB', value: 'accumulated.statLine.ab' },
        { text: 'R', value: 'accumulated.statLine.r' },
        { text: 'H', value: 'accumulated.statLine.h' },
        { text: '1B', value: 'accumulated.statLine.b1' },
        { text: '2B', value: 'accumulated.statLine.b2' },
        { text: '3B', value: 'accumulated.statLine.b3' },
        { text: 'HR', value: 'accumulated.statLine.hr' },
        { text: 'RBI', value: 'accumulated.statLine.rbi' },
        { text: 'BB', value: 'accumulated.statLine.bb' },
        { text: 'SO', value: 'accumulated.statLine.so' },
        { text: 'SAC', value: 'accumulated.statLine.sac' },
        { text: 'FoulOut', value: 'accumulated.statLine.fo' },
        { text: 'BA', value: 'accumulated.statLine.avg' },
        { text: 'OBP', value: 'accumulated.statLine.obp' },
        { text: 'SLG', value: 'accumulated.statLine.slg' },
        { text: 'OPS', value: 'accumulated.statLine.ops' },
        { text: 'OBP+', value: 'accumulated.obpplus' },
        { text: 'SLG+', value: 'accumulated.slgplus' },
        { text: 'OPS+', value: 'accumulated.opsplus' }
      ],
      summaryStats: null
    });

    axios
      .get('https://softball-reference-api.herokuapp.com/teamleagues/9')
      .then(response => {
        state.summaryStats = response.data;
      })
      .catch(error => console.log(error));

    return { ...toRefs(state) };
  }
};
</script>
