<template>
  <v-card>
    <v-card-title>{{company.title}}</v-card-title>
    <v-container>
      <v-row>
        <v-col cols="4" md="3">
          <v-img :src="company.logoURI !== null ? company.logoURI : ''"></v-img>
        </v-col>
        <v-col>
          <v-text-field
            v-model="company.title"
            label="Название"
            readonly
          ></v-text-field>
          <v-text-field
            v-model="company.fullTitle"
            label="Полное название"
            readonly
          ></v-text-field>
          <v-textarea
            v-model="company.description"
            label="Описание"
            auto-grow
            readonly
          ></v-textarea>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-tabs>
        <v-tab>Отчеты</v-tab>
        <v-tab-item>
          <v-data-table
            :headers="headersReports"
            :items="reports"
          >
            <template v-slot:item.typeReportTitle="{ item }">
              <nuxt-link :to="'/reports/' + item.id">{{item.typeReportTitle}}</nuxt-link>
            </template>
            <template v-slot:item.periodId="{ item }">
              {{getTextPeriod(item.periodId)}}
            </template>
            <template v-slot:item.currency="{ value }">
              {{ findBy(value, currencies, "value").text }}
            </template>
          </v-data-table>
          <v-simple-table>

          </v-simple-table>
        </v-tab-item>
      </v-tabs>
    </v-container>
  </v-card>
</template>

<script>
  import {getCompany} from "../../assets/js/API/company";
  import {findAllReports} from "../../assets/js/API/report";
  import {VARIANT} from "../../assets/js/constants/constants";
  import {findBy, getTextPeriod} from "../../components/mixins/utils";
  import {currencies} from "../../components/mixins/options";

  export default {
    mixins:[findBy, getTextPeriod, currencies],
    data() {
      return {
        headersReports: [
          { text: "Тип отчета", value: "typeReportTitle" },
          { text: "Период", value: "periodId" },
          { text: "Валюта", value: "currency" },
        ]
      }
    },
    async asyncData({params, $axios, store}) {

      let responseCompany = await getCompany($axios, params.id)
      let company = responseCompany.data

      let responseReports = await findAllReports($axios, {variant: VARIANT.ID, search: "company.id:" + company.id})

      return {
        company: company,
        reports: responseReports.data
      }
    }
  }
</script>

<style scoped>

</style>
