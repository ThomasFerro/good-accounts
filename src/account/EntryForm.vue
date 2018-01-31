<template>
  <v-flex xs12 fill-height>
    <v-card>
      <v-card-title>
        <div class="headline">New entry</div>
      </v-card-title>
      <v-card-text>
        <v-form v-model="isValid">
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
            class="mr-2"
            lazy
            :close-on-content-click="false"
            v-model="dateMenu"
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
            <v-date-picker v-model="entryDate" no-title scrollable actions>
              <v-card-actions slot-scope="{ save, cancel }">
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                <v-btn flat color="primary" @click="save">OK</v-btn>
              </v-card-actions>
            </v-date-picker>
          </v-menu>
          <!-- Time -->
          <v-menu
            v-if="!useDefaultDateTime"
            lazy
            :close-on-content-click="false"
            v-model="timeMenu"
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
            <v-time-picker v-model="entryTime" autosave>
              <v-card-actions slot-scope="{ save, cancel }">
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                <v-btn flat color="primary" @click="save">OK</v-btn>
              </v-card-actions>
            </v-time-picker>
          </v-menu>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          flat
          color="red"
          @click="validate"
          :disabled="!isValid"
        >Validate</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import Moment from 'moment';

import UserPicker from '@/user/UserPicker';

export default {
  name: 'entry-form',
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
    };
  },
  computed: {
    completeDateTime() {
      return Moment(`${this.entryDate}${this.entryTime}`, `${this.dateFormat} ${this.timeFormat}`).format();
    },
    entryInformations() {
      const informations = {
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
      console.log('post', this.entryInformations);
      // TODO : API POST
    },
  },
  components: {
    UserPicker,
  },
};
</script>
