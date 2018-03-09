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
    <!-- Account's data -->
    <v-card v-else>
      <v-card-title primary-title>
        <v-btn
          flat
          icon
          @click="loadAccountData"
        >
          <v-icon>refresh</v-icon>
        </v-btn>
        <!-- Loading -->
        <div
          v-if="accountLoading.status === 'loading'"
          class="headline"
        >
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          Loading account data...
        </div>
        <!-- Title -->
        <div
          v-else-if="accountLoading.status === 'success'"
          class="headline account-name"
        >{{accountData && accountData.name}}
          <v-btn
            flat
            icon
            @click="settingDialog = true"
          >
            <v-icon>build</v-icon>
          </v-btn>
        </div>
        <!-- TODO : Users' icons -->
      </v-card-title>
      <v-card-text v-if="accountLoading.status === 'error'">
        <v-alert type="error" :value="true">
          {{ accountLoading.error }}
        </v-alert>
      </v-card-text>
      <v-card-text v-else-if="accountLoading.status === 'success'">
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
    <!-- Account setting dialog -->
    <v-dialog
      v-model="settingDialog"
      fullscreen
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card tile>
        <v-toolbar card dark color="blue">
          <v-btn icon @click.native="settingDialog = false" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Account settings</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <!-- Delete button + error -->
          <v-btn
            color="error"
            dark
            @click.stop="deleteAccount"
            :loading="confirmDelete.status === 'deleting'"
          >
            {{ confirmDelete.status === 'confirm' ? 'Confirm ?' : 'Delete' }}
          </v-btn>
          <v-alert type="error" :value="confirmDelete.status === 'error'">
            {{ confirmDelete.error }}
          </v-alert>
        </v-card-text>
      </v-card>
    </v-dialog>
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
      settingDialog: false,
      confirmDelete: {
        status: '',
        timeout: {},
        error: '',
      },
      accountLoading: {
        status: 'loading',
        requestGuid: '',
      },
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
        this.accountLoading.status = 'loading';
        this.accountLoading.error = '';
        this.get({
          resource: `accounts/${this.selectedAccountId}`,
          requestGuid: this.accountLoading.requestGuid,
        })
          .then((account) => {
            this.accountData = {
              name: account.name,
              amount: account.amount,
              // TODO : Manage currency
              currency: '€',
              transactions: account.transactions,
            };
            this.accountLoading.status = 'success';
          })
          .catch((error) => {
            this.accountLoading.error = `Account loading error : ${error}`;
            this.accountLoading.status = 'error';
          });
      } else {
        this.accountData = {};
      }
    },
    deleteAccount() {
      clearTimeout(this.confirmDelete.timeout);
      if (!this.confirmDelete.status
        || this.confirmDelete.status === 'error') {
        // Confirm
        this.confirmDelete.status = 'confirm';
        this.confirmDelete.timeout = setTimeout(() => {
          this.confirmDelete.status = '';
        }, 5000);
      } else {
        // Delete
        this.confirmDelete.status = 'deleting';
        this.delete({
          resource: `accounts/${this.selectedAccountId}`,
        })
          .then(() => {
            this.confirmDelete.status = '';
            this.$store.commit('deleteAccount', this.selectedAccountId);
            this.$store.commit('changeSelectedAccount', {});
          })
          .catch((error) => {
            this.confirmDelete.error = error;
            this.confirmDelete.status = 'error';
          });
      }
    },
  },
  components: {
    ActivitiesLog,
  },
  created() {
    this.accountLoading.requestGuid = this.generateGuid();
  },
};
</script>

<style>
.account-name {
  word-break: break-all;
}
</style>

