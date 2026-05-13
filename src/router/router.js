import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import * as LoadingBar from '@/composables/useLoadingBar';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/teams/:teamName',
    name: 'TeamLeagueSummary',
    props: route => ({
      teamName: route.params.teamName,
      teamLeague: route.query.teamLeague
    }),
    component: () => import('../views/TeamLeagueSummary.vue')
  },
  {
    path: '/games/:gameId',
    name: 'GameSummary',
    props: true,
    component: () => import('../views/GameSummary.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  LoadingBar.turnOnLoadingBar();
  setTimeout(() => next(), 250);
});

router.afterEach(() => {
  LoadingBar.turnOffLoadingBar();
});

export default router;
