<template>
  <v-card>
    <v-toolbar dense flat>
      <v-toolbar-title>{{ isCreate ? "Создание компании" : company.title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!isCreate" icon @click="save">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
    </v-toolbar>
    <v-form v-model="valid">
      <v-container>
        <v-text-field
          v-model="company.title"
          :rules="[v => !!v || 'Название обязательно',]"
          label="Название"
          required
        ></v-text-field>
        <v-text-field
          v-model="company.fullTitle"
          :rules="[v => !!v || 'Полное название обязательно']"
          label="Полное название"
          required
        ></v-text-field>
        <v-toolbar v-if="isCreate" flat>
          <v-spacer></v-spacer>
          <v-btn @click="create">
            <v-icon >mdi-plus-circle</v-icon>Создать
          </v-btn>
        </v-toolbar>
      </v-container>
    </v-form>
    <v-container v-if="!isCreate">
      <v-tabs>
        <v-tab>Отчеты</v-tab>
        <v-tab-item>
          <v-data-table
            :headers="headersReports"
            :items="reports"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-btn nuxt :to="$route.fullPath + '/reports/create'">Создать</v-btn>
              </v-toolbar>
            </template>
            <template v-slot:item.typeReportId="{ value }">
              {{ findBy(value, typesReports).title }}
            </template>
            <template v-slot:item.currency="{ value }">
              {{ findBy(value, currencies, "value").text }}
            </template>
            <template v-slot:item.action="{ item }">
              <v-btn icon nuxt :to="'/admin/reports/' + item.id">
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="deleteReport(item)">
                <v-icon small >mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-tab-item>
      </v-tabs>
    </v-container>
  </v-card>
</template>

<script>
  import {ADMIN_COMPANIES, ADMIN_COMPANIES_CREATE} from "../../../../assets/js/constants/breadcrumbs";
  import {createCompany, getCompany, saveCompany} from "../../../../assets/js/API/company";
  import {deleteReport, findAllReports} from "../../../../assets/js/API/report";
  import {OPTIONS_CURRENCY} from "../../../../assets/js/constants/options";
  import {findBy} from "../../../../components/mixins/utils";
  import {findAllTypesReports} from "../../../../assets/js/API/typeReport";

  export default {
    mixins: [findBy],
    data() {
      return {
        valid: true,
        currencies: OPTIONS_CURRENCY,
        headersReports: [
          { text: "Тип отчета", value: "typeReportId" },
          { text: "Период", value: "periodId" },
          { text: "Валюта", value: "currency" },
          { text: 'Действия', value: 'action', sortable: false }
        ]
      }
    },
    async asyncData({params, $axios, store}) {
      let isCreate = params.id === "create"
      let company = {}
      let reports = []
      let typesReports = []

      if(!isCreate) {
        let responseCompany = await getCompany($axios, params.id)
        company = responseCompany.data

        let responseReports = await findAllReports($axios, {search: "company.id:" + company.id})
        reports = responseReports.data

        let responseTypesReports = await findAllTypesReports($axios)
        typesReports = responseTypesReports.data

        store.commit('breadcrumbs/set', ADMIN_COMPANIES)
        store.commit('breadcrumbs/pushActive', company.title)
      } else {
        company = {
          id: null,
          title: "",
          fullTitle: ""
        }
        store.commit('breadcrumbs/set', ADMIN_COMPANIES_CREATE)
      }

      return {
        isCreate: isCreate,
        company: company,
        reports: reports,
        typesReports: typesReports
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
      },
      deleteReport(report){
        const index = this.reports.indexOf(report)
        let answer = confirm("Вы уверены, что хотите удалить отчет?")
        if(answer) {
          deleteReport(this.$axios, report.id)
            .then((response) => {
              this.reports.splice(index, 1)
            })
        }
      }
    }
  }
</script>

<style scoped>

</style>
