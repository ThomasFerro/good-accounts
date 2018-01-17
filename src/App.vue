<template>
  <v-app id="app">
    <v-navigation-drawer
      fixed
      app
      v-model="drawer"
    >
      <v-toolbar flat>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="title">
            Good Accounts
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-toolbar>
    </v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      drawer: null,
    };
  },
};
</script>

<style>
</style>
