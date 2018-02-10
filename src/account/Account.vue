<template>
  <v-flex xs12 fill-height>
    <v-card>
      <v-card-title primary-title>
        <div class="headline">{{accountData && accountData.title}}</div>
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

export default {
  name: 'account',
  mixins: [AccountMixin],
  props: {
    accountId: String,
  },
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
      return 'ten mounths';
    },
  },
  watch: {
    accountId: {
      handler() {
        this.loadAccountData();
      },
      immediate: true,
    },
  },
  methods: {
    // Load current account's data
    loadAccountData() {
      // TODO : Load data from API
      this.accountData = {
        title: 'Compte personnel',
        amount: 125.5,
        currency: '€',
        transactions: [
          {
            amount: -120,
            subject: 'Billets de train aller-retour Paris',
            user: {
              displayName: 'Thomas',
            },
            date: '2018-01-10T18:35:24+00:00',
          }, {
            amount: 7500,
            subject: 'Salaire Janvier 2018',
            user: {
              displayName: 'Neoledge',
            },
            date: '2018-01-02T01:35:24+00:00',
          }, {
            amount: -12.10,
            subject: 'Repas Trois Brasseurs',
            user: {
              displayName: 'Thomas',
            },
            date: '2017-12-25T23:35:24+00:00',
          },
        ],
      };
    },
  },
  components: {
    ActivitiesLog,
  },
};
</script>
