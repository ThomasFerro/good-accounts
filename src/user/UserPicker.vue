<template>
  <v-select
    :label="label"
    autocomplete
    :loading="loading"
    :cache-items="cacheItems"
    :required="required"
    :items="formattedItems"
    :rules="rules"
    :search-input.sync="search"
    v-model="formattedValue"
  ></v-select>
</template>

<script>
export default {
  name: 'user-picker',
  props: {
    value: [Array, String],
    label: String,
    required: Boolean,
    rules: {
      type: Array,
      default() {
        return [() => (this.value && this.value.length > 0) || 'You must choose at least one'];
      },
    },
    cacheItems: Boolean,
  },
  data() {
    return {
      loading: false,
      items: [],
      search: null,
    };
  },
  computed: {
    formattedItems() {
      // List of items preceded by the current user
      // TODO : Add current user
      return [
        'Current User',
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
      // TODO : API request
      console.log('loadItems', query);
    },
  },
};
</script>
