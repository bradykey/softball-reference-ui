import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
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
