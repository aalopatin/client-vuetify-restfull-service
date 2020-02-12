<template>
  <v-card>
    <v-toolbar dense flat>
      <v-toolbar-title>{{ isCreate ? "Создание настройки отчетов" : setting.title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!isCreate" icon @click="save" :disabled="!valid">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
    </v-toolbar>
    <v-form v-model="valid">
      <v-col>
        <v-checkbox
          v-model="setting.common"
          label="Общая настройка"
        ></v-checkbox>
      </v-col>
      <v-col>
        <v-text-field
          v-model="setting.title"
          :rules="[v => !!v || 'Название обязательно',]"
          label="Название"
          required
        ></v-text-field>
      </v-col>
      <v-col v-if="!setting.common">
        <v-autocomplete
          v-model="setting.companyId"
          :items="companies"
          hide-no-data
          hide-selected
          label="Компания"
          item-text="title"
          item-value="id"
          :rules="[v => !!v || 'Компания обязательна для заполнения!']"
          required
        ></v-autocomplete>
      </v-col>
      <v-col>
        <v-select
          label="Стандарт"
          v-model="setting.standard"
          :items="standards"
        ></v-select>
      </v-col>
      <v-col>
        <v-select
          label="Тип отчета"
          v-model="setting.typeReportId"
          :items="filterBy(setting.standard, 'typesReports', 'standard')"
          item-text="title"
          item-value="id"
          :rules="[v => !!v || 'Тип отчета обязателен для заполнения!']"
          required
        ></v-select>
      </v-col>
      <v-col>
        <v-select
          label="Группа параметров"
          v-model="setting.groupId"
          :items="filterBy(setting.typeReportId, 'groups', 'typeReportId')"
          item-text="title"
          item-value="id"
          clearable
        ></v-select>
      </v-col>
      <v-col >
        <v-row v-if="isCreate">
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!valid"
            @click="create"
          >
            <v-icon >mdi-plus-circle</v-icon>Создать
          </v-btn>
        </v-row>
      </v-col>
    </v-form>
    <v-simple-table
      v-if="draggableRows"
    >
      <template v-slot:default>
        <thead>
          <v-switch
            dense
            v-model="draggableRows"
            label="Сортировка"
            class="pl-3"
          ></v-switch>
        <tr>
          <th width="200px" class="text-left">Тип строки</th>
          <th class="text-left">Значение</th>
        </tr>
        </thead>
        <draggable v-model="setting.rows" tag="tbody">
          <tr style="height: 37px" v-for="item in setting.rows" :key="item.typeRow + item.parameterId + item.title">
            <td>{{ findBy(item.typeRow, typesRow, "value").text }}</td>
            <td v-if="item.typeRow === 'PARAMETER' ">{{ findBy(item.parameterId, parameters).title }}</td>
            <td v-else-if="item.typeRow === 'HEADER'">{{ item.title }}</td>
            <td v-else>-</td>
          </tr>
        </draggable>
      </template>
    </v-simple-table>
    <v-data-table
      v-else
      :headers="headers"
      :items="setting.rows"
      :disable-sort="true"
      :disable-pagination="true"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-btn @click="addRow">Добавить</v-btn>
          <v-toolbar-items>
            <v-col>
              <v-switch
                dense
                v-model="draggableRows"
                label="Сортировка"
              ></v-switch>
            </v-col>
          </v-toolbar-items>
          <v-spacer/>
          <v-toolbar-items>
            <v-col>
              <v-select
                v-if="setting.groupId !== null"
                v-model="onlyCommon"
                :items="[{text: 'общие', value:true}, {text: 'из группы', value:false}]"
              ></v-select>
            </v-col>
          </v-toolbar-items>
        </v-toolbar>
      </template>
      <template v-slot:item.typeRow="props">
        <v-edit-dialog
          :return-value.sync="props.item.typeRow"
          large
          persistent
        > {{ findBy(props.item.typeRow, typesRow, "value").text }}
          <template v-slot:input>
            <v-select
              v-model="props.item.typeRow"
              :items="typesRow"
            ></v-select>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.parameterId="props">
        <v-edit-dialog
          v-if="props.item.typeRow === 'PARAMETER'"
          :return-value.sync="props.item.parameterId"
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
              required
            ></v-autocomplete>
          </template>
        </v-edit-dialog>
        <v-alert
          v-else
          color="grey lighten-5"
          class="ma-0"
        >

        </v-alert>
      </template>
      <template v-slot:item.title="props">
        <v-edit-dialog
          v-if="props.item.typeRow === 'HEADER' || props.item.typeRow === 'PARAMETER'"
          :return-value.sync="props.item.title"
          large
          persistent
        > {{ props.item.title }}
          <template v-slot:input>
            <v-text-field
              v-model="props.item.title"
              single-line
              counter
            ></v-text-field>
          </template>
        </v-edit-dialog>
        <v-alert
          v-else
          color="grey lighten-5"
          class="ma-0"
        >

        </v-alert>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn icon @click="deleteRow(item)">
          <v-icon small>mdi-close-circle</v-icon>
        </v-btn>
      </template>
    </v-data-table>

  </v-card>
</template>

<script>
  import draggable from "vuedraggable";
  import {ADMIN_SETTINGS_REPORTS, ADMIN_SETTINGS_REPORTS_CREATE} from "../../../assets/js/constants/breadcrumbs";
  import {findAllCompanies} from "../../../assets/js/API/company";
  import {OPTIONS_STANDARD, OPTIONS_TYPE_ROW_SETTING_REPORT} from "../../../assets/js/constants/options";
  import {filterBy, findBy} from "../../../components/mixins/utils";
  import {findAllTypesReports} from "../../../assets/js/API/typeReport";
  import {findAllGroupsParameters} from "../../../assets/js/API/groupParameters";
  import {createSettingReport, getSettingReport, saveSettingReport} from "../../../assets/js/API/settingReport";
  import {VARIANT} from "../../../assets/js/constants/constants";
  import {findAllParameters} from "../../../assets/js/API/parameter";

  export default {
    components: {
      draggable
    },
    mixins: [filterBy, findBy],
    data() {
      return {
        standards: OPTIONS_STANDARD,
        typesRow: OPTIONS_TYPE_ROW_SETTING_REPORT,
        onlyCommon: true,
        draggableRows: false,
        headers: [
          { text: "Тип строки", value: "typeRow", width: "15%"},
          { text: "Параметр", value: "parameterId", width: "40%" },
          { text: "Заголовок", value: "title", width: "40%" },
          { text: "", value: 'action', sortable: false, width: "5%" }
        ],
        defaultRow: {
          typeRow: "PARAMETER",
          parameterId: null,
          title: ""
        },
        valid: true
      }
    },
    async asyncData({params, $axios, store}) {

      let isCreate = params.id === "create"

      let setting = {}
      let commonParameters = []
      let selectedParameters = []
      let responseCompanies = await findAllCompanies($axios)
      let responseTypesReports = await findAllTypesReports($axios)
      let responseGroupsParameters = await findAllGroupsParameters($axios, {variant: VARIANT.ID})

      let companies = responseCompanies.data
      let groups = responseGroupsParameters.data
      let typesReports = responseTypesReports.data

      if(!isCreate) {
        let responseSetting = await getSettingReport($axios, params.id, {variant: VARIANT.ID, rows: true})
        setting = responseSetting.data

        let typeReport = typesReports.find(typeReport => typeReport.id === setting.typeReportId)

        setting.typeReportId = typeReport.id
        setting.standard = typeReport.standard

        let responseCommonParameters = await findAllParameters($axios, { search: 'group.common:true,group.typeReport.id:' + setting.typeReportId })
        commonParameters = responseCommonParameters.data

        if (setting.groupId !== null) {
          let responseParameters = await findAllParameters($axios, { search: 'group.id:' + setting.groupId })
          selectedParameters = responseParameters.data
        }

        store.commit('breadcrumbs/set', ADMIN_SETTINGS_REPORTS)
        store.commit('breadcrumbs/pushActive', setting.title)
      } else {
        setting = {
          id: null,
          title: "",
          common: false,
          companyId: null,
          standard: null,
          typeReportId: null,
          groupId: null,
          rows: []
        }
        store.commit('breadcrumbs/set', ADMIN_SETTINGS_REPORTS_CREATE)
      }
      return {
        isCreate: isCreate,
        setting: setting,
        companies: companies,
        groups: groups,
        typesReports: typesReports,
        commonParameters: commonParameters,
        selectedParameters: selectedParameters
      }
    },
    watch: {
      "setting.common": function() {
        this.setting.companyId = null
      },
      "setting.companyId": function() {
        this.setting.title = this.settingTitle()
      },
      "setting.standard": function() {
        this.setting.typeReportId = null
      },
      "setting.typeReportId": function() {
        this.setting.groupId = null
        this.setting.title = this.settingTitle()
      },
      "setting.groupId": function () {
        if(this.setting.groupId === undefined){
          this.setting.groupId = null
        }
        this.selectedParameters.splice(0, this.selectedParameters.length)
        if (this.setting.groupId !== null) {
          findAllParameters(this.$axios, { search: 'group.id:' + this.setting.groupId })
            .then((response) =>
              this.selectedParameters = response.data
            )
        }
      }
    },
    computed: {
      parameters() {
        if (this.setting.groupId === null || this.onlyCommon) {
          return this.commonParameters
        } else {
          return this.selectedParameters
        }
      }
    },
    methods: {
      save() {
        this.setting.rows = this.setting.rows
          .map((row) => {
            if (row.typeRow !== "PARAMETER") {
              row.parameterId = null
            }
            if (row.typeRow === "SEPARATOR") {
              row.title = ""
            }
            return row
          })
        saveSettingReport(this.$axios, this.setting)
      },
      create() {
        createSettingReport(this.$axios, this.setting)
          .then((response) => {
              this.isCreate = false
              this.setting.id = response.data.id
            }
          )
      },
      deleteRow(row) {
        const index = this.setting.rows.indexOf(row)
        this.setting.rows.splice(index, 1)
      },
      settingTitle() {

        let title = ""

        if ( !this.setting.common && this.setting.companyId !== null ) {
          title = this.findBy(this.setting.companyId, this.companies).title
        }

        if ( this.setting.typeReportId !== null ) {
          title += title.length != 0 ? " - " : ""
          title = title + this.findBy(this.setting.typeReportId, this.typesReports).title
        }

        if ( this.setting.standard !== null ) {
          title = title + "(" + this.findBy(this.setting.standard, this.standards, "value").text + ")"
        }

        return title
      },
      addRow() {
        this.setting.rows.push(Object.assign({}, this.defaultRow))
      }
    }
  }
</script>

<style scoped>

</style>
