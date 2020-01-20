<template>
  <v-col>
    <v-toolbar dense>
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
      <v-col v-if="!setting.common">
        <v-select
          label="Группа параметров"
          v-model="setting.groupId"
          :items="filterBy(setting.typeReportId, 'groups', 'typeReportId')"
          item-text="title"
          item-value="id"
          :rules="[v => !!v || 'Группа параметров обязательна для заполения!']"
          required
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
    <v-data-table
      v-if="!isCreate"
      :headers="headers"
      :items="setting.rows"
      :disable-pagination="true"
      :show-expand="true"
    >
      <template v-slot:top>

      </template>
    </v-data-table>
  </v-col>
</template>

<script>
  import {ADMIN_SETTINGS_REPORTS, ADMIN_SETTINGS_REPORTS_CREATE} from "../../../assets/js/constants/breadcrumbs";
  import {findAllCompanies} from "../../../assets/js/API/company";
  import {OPTIONS_STANDARD} from "../../../assets/js/constants/options";
  import {filterBy, findBy} from "../../../components/mixins/utils";
  import {findAllTypesReports} from "../../../assets/js/API/typeReport";
  import {findAllGroupsParameters} from "../../../assets/js/API/groupParameters";
  import {createSettingReport, getSettingReport, saveSettingReport} from "../../../assets/js/API/settingReport";

  export default {
    mixins: [filterBy, findBy],
    data() {
      return {
        standards: OPTIONS_STANDARD,
        companies: [],
        headers: [
          { text: "Заголовок", value: "header" },
          { text: "Показатель", value: "parameterId" },
          { text: "Текст", value: "text" }
        ],
        valid: true,
        searchCompanies: null,
        companiesLoading: false
      }
    },
    async asyncData({params, $axios, store}) {

      let isCreate = params.id === "create"

      let setting = {}
      let responseCompanies = await findAllCompanies($axios)
      let responseTypesReports = await findAllTypesReports($axios)
      let responseGroupsParameters = await findAllGroupsParameters($axios)

      let companies = responseCompanies.data
      let groups = responseGroupsParameters.data
      let typesReports = responseTypesReports.data

      if(!isCreate) {
        let responseSetting = await getSettingReport($axios, params.id, {variant: "id"})
        setting = responseSetting.data

        let group = groups.find(group => group.id === responseSetting.data.groupId)
        let typeReport = typesReports.find(typeReport => typeReport.id === group.typeReportId)

        setting.typeReportId = typeReport.id
        setting.standard = typeReport.standard

        // setting = {
        //   id: responseSetting.data.id,
        //   title: responseSetting.data.title,
        //   companyId: responseSetting.data.companyId,
        //   common: responseSetting.data.common,
        //   groupId: responseSetting.data.groupId,
        //   typeReportId: typeReport.id,
        //   standard: typeReport.standard,
        //   rows: responseSetting.data.rows
        // }

        store.commit('breadcrumbs/set', ADMIN_SETTINGS_REPORTS)
        store.commit('breadcrumbs/pushActive', setting.title)
      } else {
        setting = {
          id: undefined,
          title: "",
          common: false,
          companyId: undefined,
          standard: undefined,
          typeReportId: undefined,
          groupId: undefined,
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
      }
    },
    watch: {
      "setting.common": function() {
        this.setting.companyId = undefined
        this.setting.groupId = undefined
      },
      "setting.companyId": function() {
        this.setting.title = this.settingTitle()
      },
      "setting.standard": function() {
        this.setting.typeReportId = undefined
      },
      "setting.typeReportId": function() {
        this.setting.groupId = undefined
        this.setting.title = this.settingTitle()
      },
    },
    methods: {
      save() {
        saveSettingReport(this.$axios, this.setting)
      },
      create() {
        createSettingReport(this.$axios, this.setting)
          .then((responseSetting) => {
              this.isCreate = false
              this.setting = responseSetting.data
            }
          )
      },
      settingTitle() {

        let title = ""

        if ( !this.setting.common && this.setting.companyId !== undefined ) {
          title = this.findBy(this.setting.companyId, this.companies).title
        }

        if ( this.setting.typeReportId !== undefined ) {
          title += title.length != 0 ? " - " : ""
          title = title + this.findBy(this.setting.typeReportId, this.typesReports).title
        }

        if ( this.setting.standard !== undefined ) {
          title = title + "(" + this.findBy(this.setting.standard, this.standards, "value").text + ")"
        }

        return title
      },
    }
  }
</script>

<style scoped>

</style>
