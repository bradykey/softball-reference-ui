<template>
  <v-container>
    <TitleCard
      v-if="seasonSummary"
      :title="seasonSummary.team"
      :subtitle="seasonSummary.league"
      :divider="true"
    />

    <StatLineTable v-if="seasonSummary" :summaryStats="seasonSummary" />
  </v-container>
</template>

<script>
import StatLineTable from '@/components/StatLineTable.vue';
import TitleCard from '@/components/TitleCard.vue';
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
    TitleCard,
    StatLineTable
  },
  setup(props) {
    const state = reactive({
      seasonSummary: null
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
        state.seasonSummary = response.data;
      })
      .catch(error => console.log(error));

    return {
      ...toRefs(state)
    };
  }
};
</script>
