<template>
    <p>Основные настройки</p>
</template>

<script>
  import {BASIC_ADMIN} from "../../assets/js/constants/breadcrumbs";

  export default {
    async fetch({ store }) {
      store.commit('breadcrumbs/set', BASIC_ADMIN)
    }
  }
</script>

<style scoped>

</style>
