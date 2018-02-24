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
      ></v-text-field>
      <v-list
        dense
        class="pt-0"
      >
        <v-list-tile
          v-for="account in filteredAccountList"
          :key="account._id"
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
      <v-container fluid fill-height>
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
    </v-content>
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
      accounts: [],
      // TODO Change default icon
      defaultAccountIcon: 'dashboard',
      defaultAccountName: 'Unnamed account',
      accountQuery: '',
    };
  },
  computed: {
    filteredAccountList() {
      if (!this.accounts || !this.accounts.filter) {
        return [];
      }

      return this.accounts
        .filter(account =>
          !this.accountQuery || account.name.indexOf(this.accountQuery) > -1);
    },
  },
  methods: {
    loadAccounts() {
      this.get('accounts')
        .then((data) => {
          this.accounts = data;
          if (this.accounts &&
          this.accounts.length > 0) {
            this.selectAccount(this.accounts[0]);
          } else {
            this.selectAccount({});
          }
        })
        .catch((error) => {
          console.log('error', error);
        });
    },
    createAccount() {
      this.post('accounts', {
        name: this.accountQuery,
      })
        .then((data) => {
          this.accountQuery = '';
          this.accounts.push(data);
          this.selectAccount(data);
        })
        .catch((error) => {
          console.log('post account error', error);
        });
    },
    selectAccount(account) {
      this.selectedAccount = account;
      this.$router.push({ name: 'account' });
      this.drawer = false;
    },
  },
  created() {
    this.loadAccounts();
  },
};
</script>

<style>
.account-link {
  text-decoration: none;
}
</style>
