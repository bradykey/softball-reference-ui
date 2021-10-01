<template>
  <v-container></v-container>
</template>

<script>
import router from '@/router/router.js';

export default {
  name: 'Home',
  setup() {
    // immediately re-direct... FOR NOW
    router.push({
      name: 'TeamLeagueSummary',
      params: { teamName: 'Garden Hosers' }
    });
  }
};
</script>
