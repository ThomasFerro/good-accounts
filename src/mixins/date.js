import Moment from 'moment';

export default {
  methods: {
    relativeDate(date) {
      if (date) {
        return Moment.utc(date).fromNow();
      }
      return '';
    },
    completeDate(date) {
      if (date) {
        return Moment(date).format('LLL');
      }
      return '';
    },
  },
};
