import {findAllSettingsReports} from "../../assets/js/API/settingReport";

export const loadSettingReport = {
  data() {
    return {
      setting: {
        rows: []
      }
    }
  },
  methods: {
    async loadSettingReport(companyId, typeReportId) {
      let responseSetting = await findAllSettingsReports(this.$axios, {variant: "ID",
        rows: true,
        search: "common:false,company.id:" + companyId + ",typeReport.id:" + typeReportId})
      if(responseSetting.data.length === 0) {
        responseSetting = await findAllSettingsReports(this.$axios, {variant: "ID",
          rows: true,
          search: "common:true,typeReport.id:" + typeReportId})
        if (responseSetting.data.length === 0) {
          throw new Error("Настройка отчетов не найдена")
        }
      }

      this.setting = responseSetting.data[0]

      return
    }
  }
}
