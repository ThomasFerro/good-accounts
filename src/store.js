// Vuex store
import Vue from 'vue';
import Vuex from 'vuex';
import account from '@/account/module';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authenticationToken: '',
  },
  mutations: {
    setAuthenticationToken(state, token) {
      state.authenticationToken = token;
    },
    resetAuthenticationToken(state) {
      state.authenticationToken = '';
    },
  },
  modules: {
    account,
  },
});
