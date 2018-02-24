export default {
  computed: {
    selectedAccount: {
      get() {
        return this.$store.state
        && this.$store.state.account
        && this.$store.state.account.selectedAccount;
      },
      set(account) {
        // Commit the selected account change
        this.$store.commit('changeSelectedAccount', account);
      },
    },
    selectedAccountId() {
      return (this.selectedAccount
        // eslint-disable-next-line no-underscore-dangle
        && this.selectedAccount._id)
      || '';
    },
    selectedAccountName() {
      return (this.selectedAccount
        && this.selectedAccount.name)
      || 'Unnamed account';
    },
  },
  methods: {
    amountClass(amount) {
      if (amount) {
        return amount > 0 ? 'green--text' : 'red--text';
      }
      return '';
    },
    activityAmount(amount, currency) {
      // TODO : Manage currencyBeforeAmount
      if (amount) {
        return `${this.fixedNumber(amount)}${currency || ''}`;
      }
      return `0${currency || ''}`;
    },
    fixedNumber(number) {
      if (number) {
        return Number.parseFloat(number).toFixed(2);
      }

      return 0;
    },
  },
};
