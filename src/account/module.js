// Vuex module managing accounts' data
export default {
  state: {
    selectedAccount: {},
  },
  mutations: {
    changeSelectedAccount(state, selectedAccount) {
      state.selectedAccount = selectedAccount;
    },
  },
};
