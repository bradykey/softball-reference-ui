<template>
  <v-container>
    <StatLineTable v-if="summaryStats" :summaryStats="summaryStats" />
  </v-container>
</template>

<script>
import StatLineTable from '@/components/StatLineTable.vue';
import ApiService from '@/services/ApiService';
import { reactive, toRefs } from '@vue/composition-api';
export default {
  name: 'SummaryStatLine',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    StatLineTable
  },
  setup(props) {
    const state = reactive({
      summaryStats: null
    });

    // fetch the single season summary
    ApiService.getSeasonSummaryStatLines(props.id)
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

    return {
      ...toRefs(state)
    };
  }
};
</script>
