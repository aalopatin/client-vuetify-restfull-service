<template>
  <v-data-table
    :headers="headers"
    :items="settingsItems"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-btn nuxt :to="$route.fullPath + '/create'">Создать</v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.common="{ value }">
      <v-icon v-if="value">mdi-check</v-icon>
    </template>
    <template v-slot:item.companyId="{ value }">
      {{ findBy(value, companies).title }}
    </template>
    <template v-slot:item.standard="{ value }">
      {{ findBy(value, standards, "value").text }}
    </template>
    <template v-slot:item.groupId="{ value }">
      {{ findBy(value, groups).title }}
    </template>
    <template v-slot:item.typeReportId="{ value }">
      {{ findBy(value, typesReports).title }}
    </template>
    <template v-slot:item.action="{ item }">
      <v-btn icon nuxt :to="$route.path + '/' + item.id">
        <v-icon small>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon @click="deleteItem(item)">
        <v-icon small>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
  import {ADMIN_SETTINGS_REPORTS} from "../../../assets/js/constants/breadcrumbs";
  import {deleteSettingReport, findAllSettingsReports} from "../../../assets/js/API/settingReport";
  import {settingsItems} from "../../../components/mixins/tables";
  import {findAllGroupsParameters} from "../../../assets/js/API/groupParameters";
  import {findAllTypesReports} from "../../../assets/js/API/typeReport";
  import {findAllCompanies} from "../../../assets/js/API/company";
  import {findBy} from "../../../components/mixins/utils";
  import {OPTIONS_STANDARD} from "../../../assets/js/constants/options";

  export default {
    mixins: [settingsItems, findBy],
    data() {
      return {
        standards: OPTIONS_STANDARD,
        headers: [
          { text:"Название", value:"title"},
          { text:"Общая", value:"common"},
          { text:"Компания", value:"companyId"},
          { text:"Стандарт", value:"standard" },
          { text:"Тип отчета", value:"typeReportId"},
          { text:"Группа параметров", value:"groupId"},
          { text: 'Действия', value: 'action', sortable: false }
        ],
        settings: []
      }
    },
    async asyncData({$axios, store}) {
      store.commit('breadcrumbs/set', ADMIN_SETTINGS_REPORTS)

      let responseSettings = await findAllSettingsReports($axios, {variant: "ID"})
      let responseCompanies = await findAllCompanies($axios)
      let responseTypesReports = await findAllTypesReports($axios)
      let responseGroupsParameters = await findAllGroupsParameters($axios, {variant: "ID"})

      return {
        settings: responseSettings.data,
        companies: responseCompanies.data,
        groups: responseGroupsParameters.data,
        typesReports: responseTypesReports.data,
      }
    },
    methods: {
      deleteItem(item) {
        const index = this.settingsItems.indexOf(item)
        let answer = confirm("Вы уверены, что хотите удалить Настройку отчетов: " + item.title + "?")
        if(answer) {
          deleteSettingReport(this.$axios, item.id)
            .then((response) => {
              this.settings.splice(index, 1)
            })
        }
      },
    }
  }
</script>

<style scoped>

</style>
