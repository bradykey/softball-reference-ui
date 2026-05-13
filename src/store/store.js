import { createStore } from 'vuex';

export default createStore({
  state: {
    /* Flag to let all components know if a loading bar should be running. */
    isLoading: false
  },
  mutations: {
    SET_IS_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    }
  },
  actions: {
    setIsLoading(context, isLoading) {
      context.commit('SET_IS_LOADING', isLoading);
    }
  }
});
