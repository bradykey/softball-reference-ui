import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import store from '@/store/store';
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
  },
  {
    path: '/admin/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/admin/teamleagues/:teamLeagueId/games/new',
    name: 'AddGame',
    props: true,
    meta: { requiresAuth: true },
    component: () => import('../views/AddGame.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  LoadingBar.turnOnLoadingBar();
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    setTimeout(
      () =>
        next({
          name: 'Login',
          query: { redirect: to.fullPath }
        }),
      250
    );
    return;
  }
  setTimeout(() => next(), 250);
});

router.afterEach(() => {
  LoadingBar.turnOffLoadingBar();
});

export default router;
