import axios from 'axios';

/**
 * Api requests' mixin, implementing axios
 *
 * TODO : Implements POST / PUT / DELETE
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
            // TODO : error management
            reject(error);
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
  },
};
