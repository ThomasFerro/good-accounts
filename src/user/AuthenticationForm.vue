<template>
  <v-flex xs12 fill-height>
    <v-card>
      <v-card-title>
        <div class="headline">Authentication</div>
      </v-card-title>
      <v-card-text>
        <v-form v-model="formIsValid" ref="form">
          <!-- Email -->
          <v-select
            label="Email"
            :search-input.sync="emailSearch"
            v-model="email"
            :rules="requiredRule"
            :items="formattedEmailHistory"
            required
            @keyup.enter="signIn"
            autocomplete
          ></v-select>
          <!-- Password -->
          <v-text-field
            label="Password"
            type="password"
            v-model="password"
            :rules="requiredRule"
            required
            @keyup.enter="signIn"
          ></v-text-field>
        </v-form>
        <v-alert type="error" :value="postingSession.error">
          {{ postingSession.error }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn
          flat
          color="blue"
          @click="signIn"
          :disabled="!formIsValid"
          :loading="postingSession.status === 'loading'"
        >Sign in</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import ApiMixin from '@/mixins/api';

export default {
  name: 'authentication-form',
  mixins: [ApiMixin],
  data() {
    return {
      emailHistory: [],
      formIsValid: false,
      emailSearch: '',
      email: '',
      password: '',
      postingSession: {
        status: '',
        error: '',
      },
      requiredRule: [v => !!v || 'Required'],
    };
  },
  computed: {
    formattedEmailHistory() {
      const formattedEmailHistory = [];

      const pushIfDoesntExists = (email) => {
        if (this.emailHistory.indexOf() < 0 && email) {
          formattedEmailHistory.push(email);
        }
      };

      pushIfDoesntExists(this.emailSearch);
      pushIfDoesntExists(this.email);

      return [...formattedEmailHistory, ...this.emailHistory];
    },
  },
  methods: {
    signIn() {
      if (this.formIsValid) {
        this.postingSession = {
          status: 'loading',
          error: '',
        };
        this.post({
          resource: 'session',
          data: {
            email: this.email,
            password: this.password,
          },
        })
          .then((data) => {
            this.postingSession = {
              status: 'success',
            };
            this.addEmailToHistory(this.email);
            this.$store.commit('setAuthenticationToken', data.token);
          })
          .catch((error) => {
            this.postingSession = {
              status: 'error',
              error,
            };
          });
      }
    },
    addEmailToHistory(email) {
      this.getEmailHistory();
      // Add the mail and save
      if (this.emailHistory.indexOf(email) < 0) {
        this.emailHistory.push(email);
        localStorage.setItem('emailHistory', JSON.stringify(this.emailHistory));
      }
    },
    getEmailHistory() {
      // Get history
      const storageHistory = localStorage.getItem('emailHistory');
      if (storageHistory) {
        try {
          this.emailHistory = JSON.parse(storageHistory);
        } finally { } // eslint-disable-line no-empty
      }
    },
  },
  created() {
    this.getEmailHistory();
  },
};
</script>
