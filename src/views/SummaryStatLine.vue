<template>
  <v-container><StatLineTable /></v-container>
</template>

<script>
import StatLineTable from '@/components/StatLineTable.vue';
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
  setup() {}
};
</script>
