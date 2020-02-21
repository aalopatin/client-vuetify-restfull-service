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
        <v-row>
          <v-col cols="4" md="3">
            <v-img :src="company.logoURI !== null ? company.logoURI : ''"></v-img>
            <v-file-input
              v-model="selectedLogo"
              accept="image/png, image/jpeg, image/bmp, image/gif"
              placeholder="Выберите Логотип"
              prepend-icon="mdi-camera"
              label="Логотип"
              show-size
              hide-details
            >
              <template v-slot:append-outer>
                <v-btn small @click="uploadLogo">
                  <v-icon dense>mdi-upload</v-icon>
                </v-btn>
              </template>
            </v-file-input>
          </v-col>
          <v-col>
            <v-text-field
              v-model="company.title"
              :rules="[v => !!v || 'Название обязательно']"
              label="Название"
              required
            ></v-text-field>
            <v-text-field
              v-model="company.fullTitle"
              :rules="[v => !!v || 'Полное название обязательно']"
              label="Полное название"
              required
            ></v-text-field>

            <v-textarea
              v-model="company.description"
              :rules="[v => v === null || v.length < 1500 || 'Описание не может быть больше 1500 знаков.']"
              label="Описание"
              counter="1500"
              height="auto"
            >
            </v-textarea>
          </v-col>
        </v-row>
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
  import {createCompany, getCompany, getLogo, saveCompany, uploadLogo} from "../../../../assets/js/API/company";
  import {deleteReport, findAllReports} from "../../../../assets/js/API/report";
  import {OPTIONS_CURRENCY} from "../../../../assets/js/constants/options";
  import {findBy} from "../../../../components/mixins/utils";
  import {VARIANT} from "../../../../assets/js/constants/constants";

  export default {
    mixins: [findBy],
    data() {
      return {
        valid: true,
        currencies: OPTIONS_CURRENCY,
        selectedLogo: null,
        headersReports: [
          { text: "Тип отчета", value: "typeReportTitle" },
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

      if(!isCreate) {
        let responseCompany = await getCompany($axios, params.id)
        company = responseCompany.data

        let responseReports = await findAllReports($axios, {variant: VARIANT.ID, search: "company.id:" + company.id})
        reports = responseReports.data

        store.commit('breadcrumbs/set', ADMIN_COMPANIES)
        store.commit('breadcrumbs/pushActive', company.title)
      } else {
        company = {
          id: null,
          title: "",
          fullTitle: "",
          description: ""
        }
        store.commit('breadcrumbs/set', ADMIN_COMPANIES_CREATE)
      }

      return {
        isCreate: isCreate,
        company: company,
        reports: reports
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
      },
      uploadLogo(){
        uploadLogo(this.$axios, this.company.id, this.selectedLogo)
      }
    }
  }
</script>

<style scoped>

</style>
