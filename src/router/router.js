import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import * as LoadingBar from '@/composables/useLoadingBar';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/teams/:teamName',
    name: 'TeamLeagueSummary',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/TeamLeagueSummary.vue')
  },
  {
    path: '/games/:gameId',
    name: 'GameSummary',
    props: true,
    // beforeEnter: (to, from, next) => {
    //   // ...
    // },
    component: () => import('../views/GameSummary.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

/**
 * GLOBAL ROUTE GUARDS
 *
 * These are running progress bars between page changes, but since we aren't
 * doing API calls within our route guards, we're going to have to ALSO do
 * progress bar start/stop during the fulfillment of our API promise, per
 * component.
 */

router.beforeEach((to, from, next) => {
  LoadingBar.turnOnLoadingBar();

  // use this to see the loading bar work between each page
  setTimeout(() => next(), 250);
});

router.afterEach(() => {
  LoadingBar.turnOffLoadingBar();
});
export default router;
