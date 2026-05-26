<template>
  <v-app>
    <v-app-bar color="black">
      <div class="d-flex align-center">
        <router-link :to="{ name: 'Home' }">
          <v-img
            alt="Softball-Reference.com Logo"
            class="shrink mr-2"
            contain
            src="@/assets/sr-logo-com-hand-drawn.png"
            transition="scale-transition"
            :width="display.smAndUp.value ? 250 : 175"
          />
        </router-link>
      </div>

      <v-divider class="mx-4" vertical></v-divider>
      <v-row class="ml-2" align="center" no-gutters>
        <v-menu offset-y>
          <template v-slot:activator="{ props: menuProps }">
            <v-chip color="softball_red" variant="flat" v-bind="menuProps">
              <v-avatar start color="white">
                <v-icon color="black">mdi-baseball</v-icon>
              </v-avatar>
              Select Team
            </v-chip>
          </template>
          <v-list density="compact" rounded>
            <v-list-item
              v-for="(team, index) in teams"
              :key="index"
              :title="team.name"
              @click="goToSelectedTeam(team.name)"
            />
          </v-list>
        </v-menu>
      </v-row>
      <v-btn
        icon
        variant="text"
        :to="{ name: 'AdminHome' }"
        aria-label="Admin"
        class="mr-2"
      >
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-progress-linear
        v-if="isLoading"
        indeterminate
        absolute
        color="softball_yellow"
      />
      <!-- **NOTE:** Vue won't reload your page when you re-navigate to a page
      you already have loaded, even if the dynamic segments or query parameters
      have changed. Therefore, we can use this shortcut to force Vue to treat
      the ENTIRE path (including dynamic segments -- params -- and query params)
      as the key. You could also watch the $route object in each view:
      https://router.vuejs.org/guide/essentials/dynamic-matching.html#reacting-to-params-changes
      -->
      <router-view :key="$route.fullPath" />
    </v-main>
  </v-app>
</template>

<style>
.v-data-table thead th {
  background-color: rgb(var(--v-theme-softball_red)) !important;
}
</style>

<script>
import { computed, reactive, toRefs } from 'vue';
import { useDisplay } from 'vuetify';
import ApiService from './services/ApiService';
import * as LoadingBar from '@/composables/useLoadingBar';
import router from './router/router';
import store from './store/store';
export default {
  name: 'App',
  setup() {
    const display = useDisplay();

    const state = reactive({
      teams: null,
      selectedTeam: null
    });

    const isLoading = computed(() => store.state.isLoading);

    LoadingBar.turnOnLoadingBar();
    /*
     * Fetch the teams and fill the select menu.
     */
    ApiService.getTeams()
      .then(response => {
        state.teams = response.data;
        // sort alphabetically
        state.teams.sort();
      })
      .catch(error => console.log(error))
      .finally(() => {
        LoadingBar.turnOffLoadingBar();
      });

    function goToSelectedTeam(teamName) {
      router.push({
        name: 'TeamLeagueSummary',
        params: { teamName: teamName }
      });
    }

    return { ...toRefs(state), goToSelectedTeam, isLoading, display };
  }
};
</script>
