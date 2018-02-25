<template>
  <v-flex xs12 fill-height>
    <!-- No selected account -->
    <v-card v-if="!selectedAccountId">
      <v-card-text>
        <v-alert type="warning" :value="true">
          No account specified.
        </v-alert>
      </v-card-text>
    </v-card>
    <!-- Loading account -->
    <v-card v-else-if="accountLoading">
      <v-card-title primary-title>
        <div class="headline">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          Loading account data...
        </div>
      </v-card-title>
    </v-card>
    <!-- Account's data -->
    <v-card v-else>
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
          v-if="accountData && accountData.transactions && accountData.transactions.length > 0"
          :activities="accountData && accountData.transactions"
          :currency="accountData && accountData.currency"
        ></activities-log>

        <v-alert type="info" v-else :value="true">
          This account does not have any transaction yet.
        </v-alert>

        <!-- TODO : Graphs -->
      </v-card-text>
    </v-card>
    <!-- Error snackbar -->
    <v-snackbar
      :timeout="6000"
      color="error"
      multi-line
      v-model="errorSnackbar"
    >
      {{ errorText }}
      <v-btn dark flat @click.native="errorSnackbar = false">Close</v-btn>
    </v-snackbar>
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
      errorSnackbar: false,
      errorText: '',
      accountLoading: true,
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
        this.accountData = {};
        this.accountLoading = true;
        this.errorSnackbar = false;
        this.errorText = '';
        this.get(`accounts/${this.selectedAccountId}`)
          .then((account) => {
            this.accountData = {
              name: account.name,
              amount: account.amount,
              // TODO : Manage currency
              currency: '€',
              transactions: account.transactions,
            };
            this.accountLoading = false;
          })
          .catch((error) => {
            this.errorText = `Account loading error : ${error}`;
            this.errorSnackbar = true;
            this.accountLoading = false;
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
