import { createStore } from 'vuex';

const TOKEN_KEY = 'softball_admin_token';

export default createStore({
  state: {
    /* Flag to let all components know if a loading bar should be running. */
    isLoading: false,
    /* Admin JWT — null when logged out. Initialised from localStorage so a refresh stays logged in. */
    authToken: localStorage.getItem(TOKEN_KEY) || null
  },
  getters: {
    isAuthenticated: state => !!state.authToken
  },
  mutations: {
    SET_IS_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    SET_AUTH_TOKEN(state, token) {
      state.authToken = token;
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  },
  actions: {
    setIsLoading(context, isLoading) {
      context.commit('SET_IS_LOADING', isLoading);
    },
    setAuthToken(context, token) {
      context.commit('SET_AUTH_TOKEN', token);
    },
    logout(context) {
      context.commit('SET_AUTH_TOKEN', null);
    }
  }
});
