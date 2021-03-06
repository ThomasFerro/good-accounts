<template>
  <v-flex xs12 fill-height>
    <v-card>
      <v-card-title>
        <div class="headline">New entry ({{ selectedAccountName }})</div>
      </v-card-title>
      <v-card-text>
        <v-form v-model="isValid" ref="form">
          <!-- User involved -->
          <user-picker
            v-model="selectedUser"
            label="User"
            required
          ></user-picker>
          <!-- Entry informations -->
          <v-text-field
            v-for="input in form"
            :key="input.id"
            :type="input.type || 'text'"
            :multi-line="input.type === 'textarea'"
            :label="input.label"
            v-model="input.value"
            :rules="input.rules"
            :required="input.required"
            :step="input.step"
          ></v-text-field>
          <!-- Date -->
          <v-checkbox
            label="Now"
            v-model="useDefaultDateTime"
          ></v-checkbox>
          <v-menu
            v-if="!useDefaultDateTime"
            ref="dateMenu"
            class="mr-2"
            lazy
            :close-on-content-click="false"
            v-model="dateMenu"
            :return-value.sync="dateMenu"
            transition="scale-transition"
            offset-y
          >
            <v-text-field
              slot="activator"
              label="Date"
              v-model="entryDate"
              prepend-icon="event"
              readonly
            ></v-text-field>
            <v-date-picker v-model="entryDate" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="dateMenu = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.dateMenu.save(entryDate)">OK</v-btn>
            </v-date-picker>
          </v-menu>
          <!-- Time -->
          <v-menu
            v-if="!useDefaultDateTime"
            ref="timeMenu"
            lazy
            :close-on-content-click="false"
            v-model="timeMenu"
            :return-value.sync="entryTime"
            :disabled="useDefaultDateTime"
            transition="scale-transition"
            offset-y
          >
            <v-text-field
              slot="activator"
              label="Time"
              v-model="entryTime"
              prepend-icon="access_time"
              readonly
            ></v-text-field>
            <v-time-picker
              v-model="entryTime"
              @change="$refs.timeMenu.save(entryTime)"
            ></v-time-picker>
          </v-menu>
        </v-form>
        <v-alert type="error" :value="postingNewEntryError">
          {{ postingNewEntryError }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn
          flat
          color="blue"
          @click="validate"
          :disabled="!isValid"
          :loading="postingNewEntry"
        >Validate</v-btn>
        <v-btn
          flat
          @click="exit"
        >Exit</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import Moment from 'moment';

import UserPicker from '@/user/UserPicker';
import ApiMixin from '@/mixins/api';
import AccountMixin from '@/account/mixin';

export default {
  name: 'entry-form',
  mixins: [ApiMixin, AccountMixin],
  data() {
    return {
      isValid: false,
      selectedUser: '',
      form: [
        {
          id: 'amount',
          type: 'number',
          label: 'Amount',
          value: '',
          rules: [
            v => !!v || 'Required',
          ],
          required: true,
          step: '0.01',
        }, {
          id: 'name',
          label: 'Name',
          value: '',
          rules: [
            v => !!v || 'Required',
          ],
          required: true,
        }, {
          id: 'description',
          type: 'textarea',
          label: 'Description',
          value: '',
        },
      ],
      useDefaultDateTime: true,
      dateMenu: false,
      entryDate: '',
      timeMenu: false,
      entryTime: '',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: 'h:mma',
      postingNewEntry: false,
      postingNewEntryError: '',
    };
  },
  computed: {
    completeDateTime() {
      return Moment(`${this.entryDate}${this.entryTime}`, `${this.dateFormat} ${this.timeFormat}`).format();
    },
    entryInformations() {
      const informations = {
        user: this.selectedUser,
        date: this.completeDateTime,
      };

      this.form.forEach((input) => {
        informations[input.id] = input.value;
      });

      return informations;
    },
  },
  watch: {
    useDefaultDateTime: {
      handler(useDefault) {
        if (useDefault) {
          // Set the date
          this.setCurrentDateTime();
        }
      },
      immediate: true,
    },
  },
  methods: {
    setCurrentDateTime() {
      this.entryDate = Moment().format(this.dateFormat);
      this.entryTime = Moment().format(this.timeFormat);
    },
    validate() {
      // Post new transaction
      this.postingNewEntryError = '';
      this.postingNewEntry = true;
      this.post({
        resource: `accounts/${this.selectedAccountId}/transactions`,
        data: this.entryInformations,
      })
        .then(() => {
          this.postingNewEntry = false;
          this.resetForm();
        })
        .catch((error) => {
          this.postingNewEntryError = `An error has occurred while posting new entry : ${error}`;
          this.postingNewEntry = false;
        });
    },
    resetForm() {
      if (this.$refs.form
      && this.$refs.form.reset) {
        this.$refs.form.reset();
      }
      this.useDefaultDateTime = true;
    },
    exit() {
      this.$router.push({ name: 'account' });
    },
  },
  mounted() {
    this.resetForm();
  },
  components: {
    UserPicker,
  },
};
</script>
