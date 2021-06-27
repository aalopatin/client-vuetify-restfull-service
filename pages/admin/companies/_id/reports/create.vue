<template>
  <v-card>
    <v-card-title>Создание отчетов для компании {{ company.title }}</v-card-title>
    <v-card-text>
      <v-form v-model="valid">
        <v-col>
          <wl-period-select
            v-model="periods"
            :disabled="steps[step].form.disabled"
            :rules="[v => v.length !== 0 || 'Периоды должны быть выбраны!']"
          ></wl-period-select>
          <v-divider></v-divider>
        </v-col>
        <v-col>
          <v-select
            label="Стандарт"
            v-model="standard"
            :items="standards"
            :disabled="steps[step].form.disabled"
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            label="Тип отчета"
            v-model="typeReportId"
            :items="filterBy(standard, 'typesReports', 'standard')"
            item-text="title"
            item-value="id"
            :rules="[v => !!v || 'Тип отчета обязателен для заполнения!']"
            required
            :disabled="steps[step].form.disabled"
          ></v-select>
        </v-col>
        <v-col>
          <v-input
            label="Валюта"
            hide-details
            :disabled="steps[step].form.disabled"
          >
            <v-select
              v-model="multiplicity"
              :items="multiplicities"
              class="ml-2"
              :rules="[v => !!v || 'Кратность обязательна для заполнения!']"
              :disabled="steps[step].form.disabled"
            >
            </v-select>
            <v-select
              v-model="currency"
              :items="currencies"
              :rules="[v => !!v || 'Валюта обязательна для заполнения!']"
              :disabled="steps[step].form.disabled"
            ></v-select>
          </v-input>
        </v-col>
      </v-form>
    </v-card-text>
    <v-data-table
      dense
      :headers="headers"
      disable-pagination
      disable-sort
      hide-default-footer
      :items="data"
    >
      <template v-slot:top>
        <v-toolbar flat dense>
          <v-btn
            v-show="steps[step].back.visible"
            @click="back"
            class="mx-1"
          >
            <v-icon>mdi-chevron-double-left</v-icon>
            {{ steps[step].back.title }}
          </v-btn>
          <v-btn
            v-show="steps[step].forward.visible"
            @click="forward"
            class="mx-1"
            :disabled="!valid"
          >
            {{ steps[step].forward.title }}
            <v-icon>mdi-chevron-double-right</v-icon>
          </v-btn>
          <v-dialog
            v-if="steps[step].excel.visible"
            v-model="dialog"
            width="1000px"
          >
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon>mdi-content-paste</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Вставка данных из Excel</span>
              </v-card-title>
              <v-card-text>
                <v-textarea v-model="textExcel" rows="25"></v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="closeExcel">Отмена</v-btn>
                <v-btn text @click="saveExcel">Распознать</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[nameSlotHeaderPeriod(period)]="props"  v-for="period in periods">
        {{ period }}<v-icon :color="steps[step].headerPeriod.iconColor" v-if="reportExist(period)">{{steps[step].headerPeriod.icon}}</v-icon>
      </template>
      <template v-slot:item.message="{item}">
        <v-icon v-if="item.none" color="red">mdi-alert</v-icon>
        <v-icon v-if="item.many">mdi-file-document-box-search-outline</v-icon>
      </template>
      <template v-slot:item.title="props">
        <v-edit-dialog
          :return-value.sync="props.item.title"
        > {{ props.item.title }}
          <template v-slot:input>
            <v-text-field
              dense
              v-model="props.item.title"
              single-line
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.parameterId="props">
        <v-edit-dialog
          :return-value="props.item.parameterId"
          large
          persistent
        > {{ findBy(props.item.parameterId, parameters).title }}
          <template v-slot:input>
            <v-autocomplete
              v-model="props.item.parameterId"
              :items="parameters"
              cache-items
              hide-no-data
              item-text="title"
              item-value="id"
              :rules="[v => !!v || 'Параметр обязателен для заполнения!']"
            ></v-autocomplete>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:[nameSlotItemPeriod(period)]="props" v-for="period in periods">
        <v-edit-dialog
          :return-value.sync="props.item[period]"
        >{{ props.item[period] }}
          <template v-slot:input>
            <v-text-field
              dense
              v-model="props.item[period]"
              :label="period"
              single-line
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
    </v-data-table>
    <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout" :color="snackbar.color" top>
      {{ snackbar.text }}
      <v-btn text @click="snackbar.visible = false">Закрыть</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
  import draggable from "vuedraggable";
  import {getCompany} from "../../../../../assets/js/API/company";
  import {findAllTypesReports} from "../../../../../assets/js/API/typeReport";
  import {ADMIN_COMPANIES} from "../../../../../assets/js/constants/breadcrumbs";
  import WlPeriodSelect from "../../../../../components/parts/wl-period-select";
  import {filterBy, findBy, isEmpty} from "../../../../../components/mixins/utils";
  import {findAllSettingsReports} from "../../../../../assets/js/API/settingReport";
  import {findAllParameters} from "../../../../../assets/js/API/parameter";
  import {createReports, findAllReports} from "../../../../../assets/js/API/report";
  import {currencies, multiplicities, standards} from "../../../../../components/mixins/options";

  export default {
    components: {WlPeriodSelect, draggable},
    mixins: [filterBy, findBy, isEmpty, standards, multiplicities, currencies],
    data() {
      return {
        valid: false,
        dialog: false,
        step: 0,
        steps: [
          {
            back: { visible: false,  title: "" },
            forward: { visible: true, title: "Распознать"},
            form: { disabled: false },
            excel: { visible: true },
            headerPeriod: { icon: "", iconColor: ""}
          },
          {
            back: { visible: true,  title: "Назад" },
            forward: { visible: true, title: "Сформировать"},
            form: { disabled: true },
            excel: { visible: false },
            headerPeriod: { icon: "", iconColor: ""}
          },
          {
            back: { visible: true,  title: "Назад" },
            forward: { visible: true, title: "Сохранить"},
            form: { disabled: true },
            excel: { visible: false },
            headerPeriod: { icon: "mdi-alert-circle", iconColor: "yellow"}
          },
          {
            back: { visible: true,  title: "Назад" },
            forward: { visible: false, title: ""},
            form: { disabled: true },
            excel: { visible: false },
            headerPeriod: { icon: "mdi-check-circle", iconColor: "green"}
          },
        ],
        periods: [],
        textExcel: "",
        data: [],
        reports: [],
        headerTitle: { text: "Название показателя", value: "title"},
        headerParameter: { text: "Параметр", value: "parameterId" },
        headerRowMessage: { text: "", value: "message"},
        standard: null,
        typeReportId: null,
        multiplicity: null,
        currency: null,
        setting: null,
        commonParameters: [],
        selectedParameters: [],
        snackbar: {
          text: "",
          visible: false,
          timeout: 2000
        }
      }
    },
    async asyncData({params, $axios, store}) {

      let responseCompany = await getCompany($axios, params.id)
      let responseTypesReports = await findAllTypesReports($axios)

      store.commit('breadcrumbs/set', ADMIN_COMPANIES)
      store.commit('breadcrumbs/pushNext', {url: `/${params.id}`, exact: true, title: responseCompany.data.title})
      store.commit('breadcrumbs/pushActive', "Отчеты")
      store.commit('breadcrumbs/pushActive', "Создание")

      return {
        company: responseCompany.data,
        typesReports: responseTypesReports.data,
      }
    },
    computed: {
      headers() {
        switch (this.step) {
          case 0:
            return [
              this.headerTitle,
              ...this.headersPeriods
            ]
          case 1:
            return [
              this.headerRowMessage,
              this.headerTitle,
              this.headerParameter,
              ...this.headersPeriods
            ]
          case 2:
          case 3:
            return [
              this.headerParameter,
              ...this.headersPeriods
            ]
        }
      },
      headersPeriods() {
        return this.periods
          .map((period) => {
            return {
              text: period, value: period, width: "auto"
            }
          })
      },
      parameters() {
        let parameters = this.commonParameters.concat(this.selectedParameters)

        return parameters.map((parameter) => {
          let rowSetting = this.setting.rows
            .find((row) => row.typeRow === "PARAMETER" && row.parameterId === parameter.id)
          return {
            id: parameter.id,
            title: parameter.title,
            settingTitle: this.isEmpty(rowSetting) ? null : rowSetting.title
          }
        })
      }
    },
    watch: {
      periods() {
        return this.getHeaders
      },
      "snackbar.visible"(val) {
        if (!val) {
          this.snackbar.text = ""
        }
      },
      step(newStep, oldStep) {
        if (oldStep < newStep) { //forward
          switch (this.step) {
            case 1:
              this.loadSettingReport()
                .then(() => {
                  this.recognizeParameters()
                  if (this.checkRecognition()) {
                    this.changeStep(1)
                  } else {
                    this.showSnackbar("Не все показатели распознаны!", "red")
                  }
                })
                .catch(error => {
                  this.showSnackbar(error.message, "red")
                  this.changeStep(-1)
                })
              break
            case 2:
              this.generateReports()
              this.findExist()
              break
            case 3:
              this.saveReports()
                .then(response => {
                  response.data.forEach(report => {
                    this.reports.find(item => item.periodId === report.periodId).id = report.id
                  })
                })
                .catch(error => {
                  this.changeStep(-1)
                  this.showSnackbar(error.message, "red")
                })
          }
        }
      }
    },
    methods: {
      showSnackbar(text, color) {
        this.snackbar.visible = true
        this.snackbar.text = text
        this.snackbar.color= color
      },
      nameSlotHeaderPeriod(period) {
        return "header." + period
      },
      nameSlotItemPeriod(period) {
        return "item." + period
      },
      closeExcel() {
        this.textExcel = ""
        this.dialog = false
      },
      saveExcel() {
        this.data.splice(0)
        let dataTable = this.textExcel.split('\n')
        let countHeaders = this.headers.length

        dataTable
          .forEach((row) => {
            let newRow = this.row()
            let cells = row.split('\t')
            let countCell = cells.length
            let maxCountHeaders = countHeaders < countCell ? countHeaders : countCell
            for (let i = 0; i < maxCountHeaders ; i++ ) {
              let strValue = cells[i]
              let floatValue = parseFloat(strValue.replace(/[,]+/g, '.'))
              if (strValue !== undefined && strValue !== "") {
                newRow[this.headers[i].value] = i === 0  ? strValue : isNaN(floatValue) ? null : floatValue
              }
            }
            let blank = true
            for(let i = 0; i < this.periods.length; i++) {
              if (blank) {
                blank = newRow[this.periods[i]] === null
              } else {
                break
              }
            }
            if (!blank) {
              this.data.push(newRow)
            }
          })
        this.dialog = false
      },
      back() {
        switch (this.step) {
          case 1:
            this.changeStep(-1)
            break;
          case 2:
            this.changeStep(-1)
            break;
          case 3:
            this.changeStep(-1)
            break;
        }
      },
      forward() {
        switch (this.step) {
          case 0:
            let noData = this.data.length === 0
            if (noData) {
              this.showSnackbar("Данные для загрузки не введены!", "red")
            } else {
              this.changeStep(1)
            }
            break;
          case 1:
            this.recognizeParameters()
            if (this.checkRecognition()) {
              this.changeStep(1)
            } else {
              this.showSnackbar("Не все показатели распознаны!", "red")
            }
            break;
          case 2:
            this.changeStep(1)
            break;
        }
      },
      changeStep(step) {
        this.step = this.step + step
      },
      async loadSettingReport() {
        let responseSetting = await findAllSettingsReports(this.$axios, {variant: "ID",
                                                                  rows: true,
                                                                  search: "common:false,company.id:"+this.company.id + ",typeReport.id:" + this.typeReportId})
        if(responseSetting.data.length === 0) {
          responseSetting = await findAllSettingsReports(this.$axios, {variant: "ID",
                                                                rows: true,
                                                                search: "common:true,typeReport.id:" + this.typeReportId})
          if (responseSetting.data.length === 0) {
            throw new Error("Настройка отчетов не найдена")
          }
        }

        this.setting = responseSetting.data[0]

        let responseCommonParameters = await findAllParameters(this.$axios, { search: 'group.common:true,group.typeReport.id:' + this.typeReportId })
        this.commonParameters = responseCommonParameters.data

        if (this.setting.groupId !== null) {
          let responseSelectedParameters = await findAllParameters(this.$axios, { search: 'group.id:' + this.setting.groupId })
          this.selectedParameters = responseSelectedParameters.data
        }

        return
      },
      recognizeParameters() {
        this.data.forEach((row) =>{
          if (row.parameterId === null) {
            let findParameter = this.findParameter(row.title)
            if (findParameter.length === 0) {
              row.none = true
              row.many = false
            } else if (findParameter.length > 1) {
              row.none = false
              row.many = true
            } else {
              row.none = false
              row.many = false
              row.parameterId = findParameter[0].id
            }
          }
        })
      },
      generateReports() {
        this.reports.splice(0)
        this.periods
          .forEach((period) => {
            let report = {
              saved: false,
              id: null,
              companyId: this.company.id,
              periodId: period,
              typeReportId: this.typeReportId,
              multiplicity: this.multiplicity,
              currency: this.currency,
              rows: []
            }
            this.data.forEach((row) => {
              if (this.isEmpty(row[period])) {
                return
              }
              let rowReport = {
                parameterId: row.parameterId,
                value: row[period]
              }
              report.rows.push(rowReport)
            })
            this.reports.push(report)
          })
      },
      async findExist() {
        let searches = this.reports.map(report => {
          return "company.id:" + report.companyId + ","
                  + "period.id:" + report.periodId + ","
                  + "typeReport.id:" + report.typeReportId + ","
                   + "currency:" + report.currency
        })
        for (let i = 0; i < this.reports.length; i++) {
          let responseReport = await findAllReports(this.$axios, {search: searches[i]} )
          if (responseReport.data.length !== 0) {
            this.reports[i].id = responseReport.data[0].id
          }
        }
      },
      saveReports() {
        return createReports(this.$axios, this.reports)
      },
      row() {
        let row = {none: false, many: false, title: "", parameterId: null }
        this.headersPeriods
          .forEach((period) => {
            row[period.value] = null
          })
        return row
      },
      findParameter(title) {
        return this.parameters.filter(parameter => this.matchParameter(title, parameter))
      },
      checkRecognition() {
        return this.data.find(row => row.parameterId === null) === undefined;
      },
      matchParameter(title, parameter) {
        return title === parameter.title || title === parameter.settingTitle;
      },
      reportExist(period) {
        let report = this.reports.find(report => report.periodId === period)
        return report !== undefined && report.id !== null
      }
    }
  }
</script>

<style scoped>

</style>
