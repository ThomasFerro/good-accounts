<template>
  <v-select
    :label="label"
    autocomplete
    :loading="loading"
    :required="required"
    :items="formattedItems"
    :rules="rules"
    :search-input.sync="search"
    v-model="formattedValue"
    item-text="displayName"
    no-data-text="No user found"
    :error="userSearchError !== ''"
    :error-messages="userSearchError !== '' ? [userSearchError] : []"
  ></v-select>
</template>

<script>
import _ from 'lodash';

import ApiMixin from '@/mixins/api';

export default {
  name: 'user-picker',
  mixins: [ApiMixin],
  props: {
    value: [Array, String, Object],
    label: String,
    required: Boolean,
    rules: {
      type: Array,
      default() {
        return [() => (this.value && this.value.id !== null) || 'You must choose at least one'];
      },
    },
  },
  data() {
    return {
      loading: false,
      items: [],
      search: null,
      userSearchError: '',
    };
  },
  computed: {
    formattedItems() {
      const items = [];
      if (this.items
      && this.value
      && this.value.id
      && !_.find(this.items, ['id', this.value.id])) {
        items.push(this.value);
      }

      return [
        ...items,
        ...this.items,
      ];
    },
    formattedValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  watch: {
    search(val) {
      if (val) {
        this.loadItems(val);
      }
    },
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value);
    },
    loadItems(query) {
      this.loading = true;
      this.userSearchError = '';
      this.get('users', {
        searchQuery: query,
      })
        .then((data) => {
          if (data && data.length) {
            this.items = data;
          } else {
            this.items = [];
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.userSearchError = `User search error : ${error}`;
        });
    },
  },
};
</script>
