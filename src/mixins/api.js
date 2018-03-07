import axios from 'axios';

/**
 * Api requests' mixin, implementing axios
 *
 * TODO : Tests PUT / DELETE
 */
export default {
  data() {
    return {
      baseUrl: `${window.location.protocol}//${window.location.hostname}:3000`,
      requests: {},
    };
  },
  methods: {
    // Request
    request({ method, resource, params, data, requestGuid }) {
      return new Promise((resolve, reject) => {
        // Cancel previous request if needed
        this.cancelRequest(requestGuid);
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        this.requests[requestGuid] = source.cancel;

        axios({
          method,
          url: `${this.baseUrl}/${resource}`,
          params,
          data,
          cancelToken: source.token,
        })
          .then((success) => {
            resolve(success && success.data);
          })
          .catch((error) => {
            // Cancelled ?
            if (error && error.message
            && error.message === 'Cancelled') {
              return;
            }

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
    get({ requestGuid, resource, params }) {
      return this.request({
        method: 'get',
        resource,
        params,
        requestGuid,
      });
    },
    post({ requestGuid, resource, data }) {
      return this.request({
        method: 'post',
        resource,
        data,
        requestGuid,
      });
    },
    put({ requestGuid, resource, data }) {
      return this.request({
        method: 'put',
        resource,
        data,
        requestGuid,
      });
    },
    delete({ requestGuid, resource, params }) {
      return this.request({
        method: 'delete',
        resource,
        params,
        requestGuid,
      });
    },
    // Cancellation management
    requestExists(requestGuid) {
      return requestGuid
        && this.requests
        && this.requests[requestGuid];
    },
    // Cancel a specific request
    cancelRequest(requestGuid) {
      if (this.requestExists(requestGuid)) {
        this.requests[requestGuid]('Cancelled');
        this.removeRequest(requestGuid);
      }
    },
    // Cancel all pending requests
    cancelAllRequests() {
      if (this.requests) {
        const requests = Object.keys(this.requests);
        requests.forEach((request) => {
          this.cancelRequest(request);
        });
      }
    },
    // Remove the request from the dictionary
    removeRequest(requestGuid) {
      if (this.requestExists(requestGuid)) {
        delete this.requests[requestGuid];
      }
    },
    // Based on https://stackoverflow.com/a/105074
    generateGuid() {
      const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);

      return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
    },
  },
  beforeDestroy() {
    this.cancelAllRequests();
  },
};
