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
      :key="activity.id"
    >
      <slot :activity="activity">
        <!-- TODO Replace with user card -->
        <span>{{activity && activity.user && activity.user.displayName}}</span>
        <!-- Spent / Credited -->
        <span v-if="activity && activity.amount < 0">spent</span>
        <span v-else>credited</span>
        <!-- Amount -->
        <span
          :class="amountClass(activity && activity.amount)"
        >{{activityAmount(activity && activity.amount, currency)}}</span>
        <!-- Date -->
        <span
          :title="completeDate(activity && activity.date)"
        >{{relativeDate(activity && activity.date)}}</span>
        <br/>
        <!-- Subject -->
        <blockquote class="blockquote">{{activity && activity.subject}}</blockquote>
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
};
</script>