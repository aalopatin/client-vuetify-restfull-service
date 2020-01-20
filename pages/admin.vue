<template>
  <v-col class="pa-0">
    <v-breadcrumbs class="pa-2" large v-if="items.length" :items="items"></v-breadcrumbs>
    <nuxt-child></nuxt-child>
  </v-col>
</template>

<script>
  import { mapState } from "vuex"
  export default {
    layout: 'admin',
    computed: mapState({
      items: state => state.breadcrumbs.items
    })
  }
</script>

<style scoped>

</style>
