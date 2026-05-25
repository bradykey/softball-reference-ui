<template>
  <v-container style="max-width: 720px">
    <v-row align="center" class="mb-2">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Admin</h1>
        <p class="text-medium-emphasis mb-0">Pick an action below.</p>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="outlined" @click="onLogout">Log out</v-btn>
      </v-col>
    </v-row>

    <v-list density="comfortable" rounded class="bg-transparent">
      <v-list-item
        v-for="action in actions"
        :key="action.to.name"
        :title="action.title"
        :subtitle="action.subtitle"
        :to="action.to"
        prepend-icon="mdi-plus-circle-outline"
        class="mb-2"
        border
      />
    </v-list>
  </v-container>
</template>

<script>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'AdminHome',
  setup() {
    const router = useRouter();
    const store = useStore();

    const actions = [
      {
        title: 'Add Game',
        subtitle: 'Pick a team-league and record a new game.',
        to: { name: 'AddGamePicker' }
      }
    ];

    function onLogout() {
      store.dispatch('logout');
      router.push({ name: 'Login' });
    }

    return { actions, onLogout };
  }
};
</script>
