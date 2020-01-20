<template>
  <v-app>
    <wl-navigation-drawer-admin></wl-navigation-drawer-admin>
    <v-app-bar
      app dark
      :clipped-left="$vuetify.breakpoint.mdAndUp"
    >
      <v-toolbar-title>The Watch List</v-toolbar-title>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import WlNavigationDrawerAdmin from "../components/parts/wl-navigation-drawer-admin";
  export default {
    components: {WlNavigationDrawerAdmin}
  }
</script>

<style scoped>

</style>
