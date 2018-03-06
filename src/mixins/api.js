import axios from 'axios';

/**
 * Api requests' mixin, implementing axios
 *
 * TODO : Implements PUT / DELETE
 * TODO : Success / error management
 * TODO : Manage cancellation
 */
export default {
  data() {
    return {
      baseUrl: `${window.location.protocol}//${window.location.hostname}:3000`,
    };
  },
  methods: {
    request({ method, resource, params, data }) {
      return new Promise((resolve, reject) => {
        axios({
          method,
          url: `${this.baseUrl}/${resource}`,
          params,
          data,
        })
          .then((success) => {
            resolve(success && success.data);
          })
          .catch((error) => {
            if (error && error.response
            && error.response.data
            && error.response.data.message) {
              // API specific error messages
              reject(error.response.data.message);
            } else if (error && error.message) {
              // Basic HTTP error message
              reject(error.message);
            } else if (error && error.toString) {
              reject(error && error.toString());
            } else {
              reject(error);
            }
          });
      });
    },
    get(resource, params) {
      return this.request({
        method: 'get',
        resource,
        params,
      });
    },
    post(resource, data) {
      return this.request({
        method: 'post',
        resource,
        data,
      });
    },
  },
};
