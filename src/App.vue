<template>
  <v-app>
    <v-app-bar app color="black" dark>
      <div class="d-flex align-center">
        <router-link :to="{ name: 'Home' }">
          <v-img
            alt="Softball-Reference.com Logo"
            class="shrink mr-2"
            contain
            src="@/assets/sr-logo-com.png"
            transition="scale-transition"
            :width="$vuetify.breakpoint.smAndUp ? 250 : 175"
          />
        </router-link>
      </div>

      <v-divider class="mx-4" vertical></v-divider>
      <v-row class="ml-2">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-chip color="softball_red" v-bind="attrs" v-on="on">
              <v-avatar>
                <v-icon>mdi-baseball</v-icon>
              </v-avatar>
              Select Team
            </v-chip>
          </template>
          <v-list dense shaped>
            <v-list-item-group v-model="selectedTeam" color="softball_red">
              <v-list-item
                v-for="(team, index) in teams"
                :key="index"
                @click="goToSelectedTeam(team.name)"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="team.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-row>
    </v-app-bar>

    <v-main>
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

<script>
import { reactive, toRefs } from '@vue/composition-api';
import ApiService from './services/ApiService';
import router from './router/router';
export default {
  name: 'App',
  setup() {
    const state = reactive({
      teams: null,
      selectedTeam: null
    });

    /*
     * Fetch the teams and fill the select dropdown.
     */
    ApiService.getTeams()
      .then(response => {
        state.teams = response.data;
        // sort alphabetically
        state.teams.sort();
      })
      .catch(error => console.log(error));

    function goToSelectedTeam(teamName) {
      router.push({
        name: 'TeamLeagueSummary',
        params: { teamName: teamName }
      });
    }

    return { ...toRefs(state), goToSelectedTeam };
  }
};
</script>
