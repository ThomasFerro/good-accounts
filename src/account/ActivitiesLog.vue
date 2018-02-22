<template>
  <v-flex xs12>
    <div class="headline">
      Activites log
      <v-btn
        flat
        icon
        @click="showActivities = !showActivities"
      >
        <v-icon>{{showActivities ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</v-icon>
      </v-btn>
    </div>
    <div
      v-if="showActivities"
      v-for="activity in activities"
      :key="activity._id"
    >
      <slot :activity="activity">
        <!-- User card -->
        <v-layout
          class="user-card"
          align-center
          row
        >
          <v-avatar
            :class="(activity && activity.user && activity.user.color) || 'red'"
            size="32px"
          >
            <span
              class="white--text"
            >{{userInitials(activity)}}</span>
          </v-avatar>
          <span>&nbsp;{{userDisplayName(activity)}}&nbsp;</span>
          <!-- Spent / Credited -->
          <span v-if="activity && activity.amount < 0">spent&nbsp;</span>
          <span v-else>credited </span>
          <!-- Amount -->
          <span
            :class="amountClass(activity && activity.amount)"
          >{{activityAmount(activity && activity.amount, currency)}}&nbsp;</span>
          <!-- Date -->
          <span
            :title="completeDate(activity && activity.date)"
          >{{relativeDate(activity && activity.date)}}</span>
        </v-layout>
        <!-- Subject -->
        <blockquote class="blockquote">
          {{activity && activity.name}}
          <br/>
          {{activity && activity.description}}
        </blockquote>
      </slot>
    </div>
  </v-flex>
</template>

<script>
import DateMixin from '@/mixins/date';
import AccountMixin from '@/account/mixin';

export default {
  name: 'activities-logs',
  mixins: [DateMixin, AccountMixin],
  data() {
    return {
      showActivities: true,
    };
  },
  props: {
    activities: Array,
    currency: String,
  },
  methods: {
    userInitials(activity) {
      if (activity
      && activity.user) {
        if (activity.user.initials) {
          return activity.user.initials;
        }
        const firstName = (activity.user.firstName && activity.user.firstName[0])
        || '';
        const lastName = (activity.user.lastName && activity.user.lastName[0])
        || '';
        return `${firstName}${lastName}`;
      }
      return '';
    },
    userDisplayName(activity) {
      if (activity
      && activity.user) {
        if (activity.user.displayName) {
          return activity.user.displayName;
        }
        return `${activity.user.firstName} ${activity.user.lastName}`;
      }
      return '';
    },
  },
};
</script>

<style>
.user-card {
  white-space: pre;
}
</style>
