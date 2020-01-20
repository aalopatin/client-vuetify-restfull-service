<template>
  <v-data-table
    :headers="headers"
    :items="companies"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-btn nuxt :to="$route.fullPath + '/create'">Создать</v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-btn icon nuxt :to="$route.path + '/' + item.id">
        <v-icon small>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon @click="deleteItem(item)">
        <v-icon small >mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
  import {ADMIN_COMPANIES} from "../../../assets/js/constants/breadcrumbs";
  import {deleteCompany, findAllCompanies} from "../../../assets/js/API/company";

  export default {
    data() {
      return {
        headers: [
          { text:"Название", value:"title" },
          { text:"Полное название", value:"fullTitle" },
          { text: 'Действия', value: 'action', sortable: false }
        ]
      }
    },
    async asyncData({$axios, store}) {
      store.commit('breadcrumbs/set', ADMIN_COMPANIES)
      let responseCompanies = await findAllCompanies($axios)
      return {companies: responseCompanies.data}
    },
    methods: {
      deleteItem(item) {
        const index = this.companies.indexOf(item)
        let answer = confirm("Вы уверены, что хотите удалить компанию: " + item.title + "?")
        if(answer) {
          deleteCompany(this.$axios, item.id)
            .then((response) => {
              this.companies.splice(index, 1)
            })
        }
      },
    }
  }
</script>

<style scoped>

</style>
