<template>
  <v-flex xs12 fill-height>
    <v-card>
      <v-card-title primary-title>
        <div class="headline">{{accountData && accountData.name}}</div>
        <!-- TODO : Users' icons -->
      </v-card-title>
      <v-card-text>
        <!-- Summary -->
        <p>
          The total account amount is
          <!-- Amount -->
          <span
            :class="amountClass(accountData && accountData.amount)"
          >{{
            activityAmount(accountData && accountData.amount, accountData && accountData.currency)
            }}</span>
          with a fluctuation of
          <!-- Fluctuation -->
          <span
            :class="amountClass(lastTransactionsAmount)"
          >{{activityAmount(lastTransactionsAmount, accountData && accountData.currency)}}</span>
          over the last {{lastTransactionsDate}}.
        </p>

        <!-- Activities log -->
        <activities-log
          :activities="accountData && accountData.transactions"
          :currency="accountData && accountData.currency"
        ></activities-log>

        <!-- TODO : Graphs -->
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
import ActivitiesLog from '@/account/ActivitiesLog';
import AccountMixin from '@/account/mixin';
import ApiMixin from '@/mixins/api';

export default {
  name: 'account',
  mixins: [ApiMixin, AccountMixin],
  data() {
    return {
      accountData: {},
    };
  },
  computed: {
    // Show currency before the amount ?
    currencyBeforeAmount() {
      return this.accountData && this.accountData.currencyBeforeAmount;
    },
    // Total amount of the last transactions
    lastTransactionsAmount() {
      let amount = 0;

      if (this.accountData && this.accountData.transactions) {
        this.accountData.transactions.forEach((transaction) => {
          if (transaction && transaction.amount) {
            amount += transaction.amount;
          }
        });
      }

      return amount;
    },
    // Last transactions' relative date
    lastTransactionsDate() {
      // TODO : Use Moment to find the relative date
      return 'six mounths';
    },
  },
  watch: {
    selectedAccountId: {
      handler() {
        this.loadAccountData();
      },
      immediate: true,
    },
  },
  methods: {
    // Load current account's data
    loadAccountData() {
      if (this.selectedAccountId) {
        this.get(`accounts/${this.selectedAccountId}`)
          .then((account) => {
            this.accountData = {
              name: account.name,
              amount: account.amount,
              // TODO : Manage currency
              currency: '€',
              transactions: account.transactions,
            };
          })
          .catch((error) => {
            console.log('Account get error', error);
          });
      } else {
        this.accountData = {};
      }
    },
  },
  components: {
    ActivitiesLog,
  },
};
</script>
