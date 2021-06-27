<template>
    <v-card>
      <v-container fluid>
        <v-row>
          <v-col cols="2" class="font-weight-black">
            Компания:
          </v-col>
          <v-col>
            {{report.companyTitle}}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2" class="font-weight-black">
            Отчет:
          </v-col>
          <v-col>
            {{report.typeReportTitle + " (" + findBy(typeReport.standard, standards, "value").text + ")"}}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2" class="font-weight-black">
            Период:
          </v-col>
          <v-col>
            {{getTextPeriod(report.periodId)}}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2" class="font-weight-black">
            Валюта:
          </v-col>
          <v-col>
            {{findBy(report.multiplicity, multiplicities, "value").text + " " + findBy(report.currency, currencies, "value").text}}
          </v-col>
        </v-row>
      </v-container>
      <wl-report-viewer :data="dataReportViewer" :periods="periodsReportViewer" :setting="setting"></wl-report-viewer>
    </v-card>
</template>

<script>
  import {getReport} from "../../assets/js/API/report";
  import {findBy, getTextPeriod} from "../../components/mixins/utils";
  import {getTypeReport} from "../../assets/js/API/typeReport";
  import {currencies, multiplicities, standards} from "../../components/mixins/options";
  import {loadSettingReport} from "../../components/mixins/data";
  import {dataReportViewerFromReport} from "../../components/mixins/report-viewer";
  import WlReportViewer from "../../components/parts/wl-report-viewer";

  export default {
    components: {WlReportViewer},
    mixins: [getTextPeriod, findBy, currencies, multiplicities, standards, loadSettingReport, dataReportViewerFromReport],
    data() {
      return {
        report: {
          companyTitle: null,
          periodId: null,
          typeReportTitle: null,
          multiplicity: null,
          currency: null
        },
        typeReport: {
          standard: null
        }
      }
    },
    asyncData({params, $axios, error}) {
      return getReport($axios, params.id)
        .then((response) => {
          let report = response.data
          return getTypeReport($axios, report.typeReportId)
            .then((response) => {
              console.log(report)
              return {
                report: report,
                typeReport: response.data
              }
            })
        })
        .catch((e) => {
          console.log(e)
          error({ statusCode: 404, message: "MESSAGE" })
        })
    },
    created() {
      if(!this.$isServer) {
        console.log("Created")
        this.loadSettingReport(this.report.companyId, this.report.typeReportId)
      }
    }
  }
</script>

<style scoped>

</style>
