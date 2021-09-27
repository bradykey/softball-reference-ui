<template>
  <v-app>
    <v-app-bar app color="black" dark>
      <div class="d-flex align-center">
        <router-link :to="{ name: 'Home' }">
          <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="@/assets/sr-logo-com.png"
            transition="scale-transition"
            :width="$vuetify.breakpoint.smAndUp ? 250 : 175"
          />
        </router-link>
      </div>

      <v-spacer></v-spacer>
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
export default {
  name: 'App',

  data: () => ({
    //
  })
};
</script>
