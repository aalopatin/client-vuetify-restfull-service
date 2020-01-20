<template>
  <v-col>
    <v-toolbar dense>
      <v-toolbar-title>{{ isCreate ? "Создание компании" : company.title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!isCreate" icon @click="save">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
    </v-toolbar>
    <v-form v-model="valid">
      <v-col>
        <v-text-field
          v-model="company.title"
          :rules="[v => !!v || 'Название обязательно',]"
          label="Название"
          required
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="company.fullTitle"
          :rules="[v => !!v || 'Полное название обязательно']"
          label="Полное название"
          required
        ></v-text-field>
      </v-col>
      <v-col v-if="isCreate">
        <v-row>
          <v-spacer></v-spacer>
          <v-btn @click="create">
            <v-icon >mdi-plus-circle</v-icon>Создать
          </v-btn>
        </v-row>
      </v-col>
    </v-form>
  </v-col>
</template>

<script>
  import {ADMIN_COMPANIES, ADMIN_COMPANIES_CREATE} from "../../../../assets/js/constants/breadcrumbs";
  import {createCompany, getCompany, saveCompany} from "../../../../assets/js/API/company";

  export default {
    data() {
      return {
        valid: true
      }
    },
    async asyncData({params, $axios, store}) {
      let isCreate = params.id === "create"
      let company = {}
      if(!isCreate) {
        let responseCompany = await getCompany($axios, params.id)
        company = responseCompany.data
        store.commit('breadcrumbs/set', ADMIN_COMPANIES)
        store.commit('breadcrumbs/pushActive', company.title)
      } else {
        company = {
          id: undefined,
          title: "",
          fullTitle: ""
        }
        store.commit('breadcrumbs/set', ADMIN_COMPANIES_CREATE)
      }

      return {
        isCreate: isCreate,
        company: company
      }
    },
    methods: {
      save() {
        saveCompany(this.$axios, this.company)
      },
      create() {
        createCompany(this.$axios, this.company)
          .then((responseCompany) => {
            this.isCreate = false
            this.company = responseCompany.data
          }
        )
      }
    }
  }
</script>

<style scoped>

</style>
