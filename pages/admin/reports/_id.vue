<template>
  <v-card>
    <v-card-title>
      {{ reportTitle }}
        <v-spacer></v-spacer>
        <v-btn icon @click="save" :disabled="!valid">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid">
        <v-container>
          <v-autocomplete
            v-model="report.companyId"
            :items="companies"
            hide-no-data
            hide-selected
            label="Компания"
            item-text="title"
            item-value="id"
            :rules="[v => !!v || 'Компания обязательна для заполнения!']"
            required
          ></v-autocomplete>
          <v-autocomplete
            v-model="report.periodId"
            :items="periods"
            hide-no-data
            hide-selected
            label="Период"
            item-text="id"
            item-value="id"
            :rules="[v => !!v || 'Период обязателен для заполнения!']"
            required
          ></v-autocomplete>
          <v-select
            label="Стандарт"
            v-model="report.standard"
            :items="standards"
          ></v-select>
          <v-select
            label="Тип отчета"
            v-model="report.typeReportId"
            :items="filterBy(report.standard, 'typesReports', 'standard')"
            item-text="title"
            item-value="id"
            :rules="[v => !!v || 'Тип отчета обязателен для заполнения!']"
            required
          ></v-select>
              <v-input
                label="Валюта"
                hide-details
              >
                <v-select
                  v-model="report.multiplicity"
                  :items="multiplicities"
                  class="ml-2"
                  :rules="[v => !!v || 'Кратность обязательна для заполнения!']"
                >
                </v-select>
                <v-select
                  v-model="report.currency"
                  :items="currencies"
                  :rules="[v => !!v || 'Валюта обязательна для заполнения!']"
                ></v-select>
              </v-input>

        </v-container>
      </v-form>
    </v-card-text>

  </v-card>
</template>

<script>
  import {getReport} from "../../../assets/js/API/report";
  import {VARIANT} from "../../../assets/js/constants/constants";
  import {findAllCompanies} from "../../../assets/js/API/company";
  import {findAllTypesReports} from "../../../assets/js/API/typeReport";
  import {findAllPeriods} from "../../../assets/js/API/period";
  import {filterBy} from "../../../components/mixins/utils";
  import {currencies, multiplicities, standards} from "../../../components/mixins/options";

  export default {
    mixins: [filterBy, standards, multiplicities, currencies],
    data() {
      return {
        valid: false
      }
    },
    async asyncData({params, $axios, store}) {

      let responseReport = await getReport($axios, params.id, {variant: VARIANT.ID, rows: true})
      let report = responseReport.data

      let responseCompanies = await findAllCompanies($axios)
      let companies = responseCompanies.data

      let responsePeriods = await findAllPeriods($axios)
      let periods = responsePeriods.data

      let responseTypesReports = await findAllTypesReports($axios)
      let typesReports = responseTypesReports.data

      let typeReport = typesReports.find(typeReport => typeReport.id === report.typeReportId)

      report.typeReportId = typeReport.id
      report.standard = typeReport.standard

      return {
        report: report,
        companies: companies,
        periods: periods,
        typesReports: typesReports
      }

    },
    computed: {
      reportTitle() {
        let typeReport = this.typesReports.find(typeReport => typeReport.id === this.report.typeReportId)
        console.log(typeReport)
        let standard = this.standards.find(standard => standard.value === this.report.standard)
        console.log(standard)
        return typeReport.title + "(" + standard.text + ")"
      },
    },
    methods: {

      save() {

      }
    }
  }
</script>

<style scoped>

</style>
