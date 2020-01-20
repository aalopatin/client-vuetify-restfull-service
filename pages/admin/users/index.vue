<template>
  <p>Пользователи</p>
</template>

<script>
  import {ADMIN_USERS} from "../../../assets/js/constants/breadcrumbs";

  export default {
    async asyncData({$axios, store}) {
      store.commit('breadcrumbs/set', ADMIN_USERS)
    },
  }
</script>

<style scoped>

</style>
