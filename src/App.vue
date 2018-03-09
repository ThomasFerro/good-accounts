<template>
  <v-app id="app">
    <v-navigation-drawer
      fixed
      app
      v-model="drawer"
    >
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <router-link class="account-link" :to="{ name: 'home' }">
              <v-list-tile-title class="title">
                Good Accounts
              </v-list-tile-title>
            </router-link>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-text-field
        class="px-2"
        v-model="accountQuery"
        :append-icon="'add_circle'"
        :append-icon-cb="createAccount"
        @keyup.enter="createAccount"
        :loading="accountCreationLoading"
        :error="accountCreatingError !== ''"
        :error-messages="accountCreatingError !== '' ? [accountCreatingError] : []"
      ></v-text-field>
      <v-list
        dense
        class="pt-0"
      >
        <!-- Reload -->
        <v-list-tile
          @click="refreshAccounts">
          <v-list-tile-action>
            <v-icon v-if="!accountsLoading.loadingStatus">refresh</v-icon>
            <v-progress-circular
              v-else
              indeterminate
              :size="22"
            ></v-progress-circular>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Refresh accounts</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- Accounts -->
        <v-list-tile
          v-for="account in filteredAccountList"
          :key="account.id"
          @click="selectAccount(account)"
        >
          <v-list-tile-action>
            <v-icon>{{ account.icon || defaultAccountIcon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title :class="{ 'blue--text': selectedAccount === account }">
              {{ account.name || defaultAccountName }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    </v-toolbar>
    <v-content>
      <v-container
        fluid
        fill-height
        v-if="selectedAccountId"
      >
        <router-view></router-view>
        <router-link :to="{ name: 'newEntry' }">
          <v-btn
            fixed
            bottom
            right
            dark
            fab
            color="blue"
          >
            <v-icon>add</v-icon>
          </v-btn>
        </router-link>
      </v-container>
      <v-container
        fluid
        fill-height
        v-else
      >
        <v-flex xs12 fill-height>
          <v-card fill-height>
            <v-card-title primary-title>
              <div class="headline">No account selected</div>
            </v-card-title>
            <v-card-text>
              <p>
                To create an account, simply type a name in the text field inside
                the left menu then press the "Enter" key or click the
                <v-icon>add_circle</v-icon> icon.
              </p>
              <p>
                You can also select an account that already exists in the list
                following the text field.
                <br/>
                If the list has too many elements, you can filter it via the same input.
              </p>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-container>
    </v-content>
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
  </v-app>
</template>

<script>
import ApiMixin from '@/mixins/api';
import AccountMixin from '@/account/mixin';

export default {
  name: 'App',
  mixins: [ApiMixin, AccountMixin],
  data() {
    return {
      drawer: null,
      // TODO Change default icon
      defaultAccountIcon: 'dashboard',
      defaultAccountName: 'Unnamed account',
      accountQuery: '',
      accountsLoading: {
        loadingStatus: false,
        requestGuid: '',
      },
      errorSnackbar: false,
      errorText: '',
      accountCreationLoading: false,
      accountCreatingError: '',
    };
  },
  computed: {
    accounts: {
      get() {
        return this.$store.state
        && this.$store.state.account
        && this.$store.state.account.accounts;
      },
      set(value) {
        this.$store.commit('setAccounts', value);
      },
    },
    filteredAccountList() {
      if (!this.accounts || !this.accounts.filter) {
        return [];
      }

      return this.accounts
        .filter(account =>
          !this.accountQuery
          || (account.name
            && account.name.toLowerCase().indexOf(this.accountQuery.toLowerCase()) > -1));
    },
  },
  methods: {
    refreshAccounts() {
      this.loadAccounts();
      this.drawer = true;
    },
    loadAccounts() {
      this.selectAccount({});
      this.accounts = [];
      this.accountsLoading.loadingStatus = true;
      this.get({
        resource: 'accounts',
        requestGuid: this.accountsLoading.requestGuid,
      })
        .then((data) => {
          this.accountsLoading.loadingStatus = false;
          this.accounts = data;
        })
        .catch((error) => {
          this.accountsLoading.loadingStatus = false;
          this.errorText = `Loading accounts error : ${error}`;
          this.errorSnackbar = true;
        });
    },
    createAccount() {
      if (this.accountQuery) {
        this.accountCreationLoading = true;
        this.accountCreatingError = '';
        this.post({
          resource: 'accounts',
          data: {
            name: this.accountQuery,
          },
        })
          .then((data) => {
            this.accountCreationLoading = false;
            this.accountQuery = '';
            this.accounts.push(data);
            this.selectAccount(data);
          })
          .catch((error) => {
            this.accountCreationLoading = false;
            this.accountCreatingError = `Creating account error : ${error}`;
          });
      }
    },
    selectAccount(account) {
      this.selectedAccount = account;
      this.$router.push({ name: 'account' });
      this.drawer = false;
    },
  },
  created() {
    this.accountsLoading.requestGuid = this.generateGuid();
    this.loadAccounts();
  },
};
</script>

<style>
.account-link {
  text-decoration: none;
}
</style>
