import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    /* Flag to let all components know if a loading bar shoudl be running. */
    isLoading: false
  },
  mutations: {
    SET_IS_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    }
  },
  actions: {
    /**
     * Commits the SET_IS_LOADING mutation with the passed in Boolean as the
     * payload.
     *
     * @param {Context} context the automatically passed in context object that
     * contains: state (same as store.state, or local state if in modules),
     * rootState (same as store.state, only in modules), commite (same as
     * store.commit), dispatch (same as store.dispatch), getters (same as
     * store.getters, or local getters if in modules), rootGetters (same as
     * store.getters, only in modules)
     * @param {Boolean} isLoading
     */
    setIsLoading(context, isLoading) {
      context.commit('SET_IS_LOADING', isLoading);
    }
  }
});
