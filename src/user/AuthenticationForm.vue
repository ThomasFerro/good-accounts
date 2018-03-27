<template>
  <v-flex xs12 fill-height>
    <v-card
      v-if="!registrationForm.isActive"
      key="authenticationForm"
    >
      <v-card-title>
        <div class="headline">Authentication</div>
      </v-card-title>
      <v-card-text>
        <v-form v-model="authenticationForm.isValid">
          <!-- Email -->
          <v-select
            label="Email"
            :search-input.sync="emailSearch"
            v-model="authenticationForm.email"
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
            v-model="authenticationForm.password"
            :rules="requiredRule"
            required
            @keyup.enter="signIn"
          ></v-text-field>
        </v-form>
        <v-alert type="error" :value="authenticationForm.error">
          {{ authenticationForm.error }}
        </v-alert>
        <v-alert type="success" :value="authenticationForm.success">
          {{ authenticationForm.success }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn
          flat
          color="blue"
          @click="signIn"
          :disabled="!authenticationForm.isValid"
          :loading="authenticationForm.status === 'loading'"
        >Sign in</v-btn>
        <v-btn
          flat
          color="dark"
          @click="registrationForm.isActive = true"
        >Sign up</v-btn>
      </v-card-actions>
    </v-card>
    <v-card
      v-else
      key="registrationForm"
    >
      <v-card-title>
        <div class="headline">Registration</div>
      </v-card-title>
      <v-card-text>
        <v-form v-model="registrationForm.isValid">
          <v-text-field
            v-for="(field, fieldId) in registrationForm.fields"
            :key="fieldId"
            :label="field.label"
            :type="field.type"
            v-model="field.value"
            :rules="field.rules ? getFieldRules(field.rules) : requiredRule"
            required
            @keyup.enter="signUp"
          ></v-text-field>
        </v-form>
        <v-alert type="error" :value="registrationForm.error">
          {{ registrationForm.error }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn
          flat
          color="blue"
          @click="signUp"
          :disabled="!registrationForm.isValid"
          :loading="registrationForm.status === 'loading'"
        >Sign up</v-btn>
        <v-btn
          flat
          color="red"
          @click="registrationForm.isActive = false"
        >Cancel</v-btn>
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
      emailSearch: '',
      authenticationForm: {
        isValid: false,
        email: '',
        password: '',
        status: '',
        error: '',
      },
      registrationForm: {
        isActive: false,
        isValid: false,
        status: '',
        error: '',
        requestGuid: '',
        fields: {
          email: {
            label: 'Email',
            value: '',
          },
          confirmEmail: {
            label: 'Confirm email',
            value: '',
            rules: 'emailAddressesMustMatchRule',
            ignore: true,
          },
          firstName: {
            label: 'First name',
            value: '',
          },
          lastName: {
            label: 'Last name',
            value: '',
          },
          nickname: {
            label: 'Nickname',
            value: '',
          },
          password: {
            label: 'Password',
            type: 'password',
            value: '',
          },
          confirmPassword: {
            label: 'Confirm password',
            type: 'password',
            value: '',
            rules: 'passwordsMustMatchRule',
            ignore: true,
          },
        },
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
      pushIfDoesntExists(this.authenticationForm.email);

      return [...formattedEmailHistory, ...this.emailHistory];
    },
    emailAddressesMustMatchRule() {
      return [
        ...this.requiredRule,
        this.emailAddressesMustMatch,
      ];
    },
    passwordsMustMatchRule() {
      return [
        ...this.requiredRule,
        this.passwordsMustMatch,
      ];
    },
  },
  methods: {
    signIn() {
      if (this.authenticationForm.isValid) {
        this.authenticationForm.status = 'loading';
        this.authenticationForm.error = '';
        this.post({
          resource: 'session',
          data: this.authenticationForm,
        })
          .then((data) => {
            this.authenticationForm.status = 'success';
            this.addEmailToHistory(this.authenticationForm.email);
            this.$store.commit('setAuthenticationToken', data.token);
          })
          .catch((error) => {
            this.authenticationForm.status = 'error';
            this.authenticationForm.error = error;
          });
      }
    },
    signUp() {
      if (this.registrationForm.isValid) {
        const fieldKeys = Object.keys(this.registrationForm.fields);
        const data = {};
        fieldKeys.forEach((field) => {
          if (!this.registrationForm.fields[field].ignore) {
            data[field] = this.registrationForm.fields[field].value;
          }
        });
        this.registrationForm.status = 'loading';
        this.registrationForm.error = '';
        this.post({
          resource: 'users',
          requestGuid: this.registrationForm.requestGuid,
          data,
        })
          .then(() => {
            this.registrationForm.status = 'success';
            this.addEmailToHistory(this.registrationForm.fields.email.value);
            // Switch to authentication form with preset email
            this.registrationForm.isActive = false;
            this.authenticationForm.success = 'Account successfully created';
            this.authenticationForm.email = this.registrationForm.fields.email.value;
          })
          .catch((error) => {
            this.registrationForm.status = 'error';
            this.registrationForm.error = error;
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
    getFieldRules(rules) {
      return this[rules];
    },
    emailAddressesMustMatch(confirmedEmail) {
      return confirmedEmail === this.registrationForm.fields.email.value
        || 'Email addresses must match';
    },
    passwordsMustMatch(confirmedPassword) {
      return confirmedPassword === this.registrationForm.fields.password.value
        || 'Passwords must match';
    },
  },
  created() {
    this.registrationForm.requestGuid = this.generateGuid();
    this.getEmailHistory();
  },
};
</script>
