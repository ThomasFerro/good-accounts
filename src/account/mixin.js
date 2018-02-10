export default {
  methods: {
    amountClass(amount) {
      if (amount) {
        return amount > 0 ? 'green--text' : 'red--text';
      }
      return '';
    },
    activityAmount(amount, currency) {
      // TODO : Manage currencyBeforeAmount
      return `${amount}${currency}`;
    },
  },
};
