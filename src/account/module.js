import _ from 'lodash';

// Vuex module managing accounts' data
export default {
  state: {
    accounts: [],
    selectedAccount: {},
  },
  mutations: {
    setAccounts(state, payload) {
      state.accounts = payload;
    },
    changeSelectedAccount(state, selectedAccount) {
      state.selectedAccount = selectedAccount;
    },
    deleteAccount(state, accountId) {
      if (state.accounts && accountId) {
        const index = _.findIndex(state.accounts, ['id', accountId]);
        if (index >= 0) {
          state.accounts.splice(index, 1);
        }
      }
    },
  },
};
