<template>
  <v-app id="app">
    <v-navigation-drawer
      fixed
      app
      v-model="drawer"
    >
      <v-toolbar flat>
      <v-list>
        <router-link class="home-link" :to="{ name: 'home' }">
          <v-list-tile>
            <v-list-tile-title class="title">
              Good Accounts
            </v-list-tile-title>
          </v-list-tile>
        </router-link>
      </v-list>
    </v-toolbar>
    </v-navigation-drawer>
    <v-toolbar fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <router-view></router-view>
        <router-link :to="{ name: 'newEntry' }">
          <v-btn
            fixed
            bottom
            right
            dark
            fab
            color="red"
          >
            <v-icon>add</v-icon>
          </v-btn>
        </router-link>
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
.home-link {
  text-decoration: none;
}
</style>
