<template>
  <v-flex xs12 fill-height>
    <v-form v-model="isValid">
      <v-text-field
        label="Test"
        v-model="test"
        :rules="testRules"
        required></v-text-field>
    </v-form>
  </v-flex>
</template>

<script>
export default {
  name: 'entry-form',
  data() {
    return {
      isValid: false,
      test: '',
      testRules: [
        v => !!v || 'Required',
        v => v.length <= 10 || 'Name must be less than 10 characters',
      ],
    };
  },
};
</script>
