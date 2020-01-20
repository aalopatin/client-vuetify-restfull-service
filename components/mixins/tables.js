export const parametersItems = {
  computed: {
    parametersItems() {
      return this.parameters.map((parameter) => {
        let group = this.groups.find(group => group.id === parameter.groupId)
        let typeReport = this.typesReports.find(typeReport => typeReport.id === group.typeReportId)
        return {
          id: parameter.id,
          title: parameter.title,
          cumulative: parameter.cumulative,
          groupId: parameter.groupId,
          typeReportId: typeReport.id,
          standard: typeReport.standard
        }
      })
    }
  }
}

export const groupsItems = {
  computed: {
    groupsItems() {
      return this.groups.map((group) => {
        let typeReport = this.typesReports.find(typeReport => typeReport.id === group.typeReportId)
        return {
          id: group.id,
          title: group.title,
          basic: group.basic,
          typeReportId: typeReport.id,
          standard: typeReport.standard
        }
      })
    }
  }
}

export const settingsItems = {
  computed: {
    settingsItems() {
      return this.settings.map((setting) => {
        let group = this.groups.find(group => group.id === setting.groupId)
        let typeReport = this.typesReports.find(typeReport => typeReport.id === group.typeReportId)
        return {
          id: setting.id,
          title: setting.title,
          companyId: setting.companyId,
          common: setting.common,
          groupId: setting.groupId,
          typeReportId: typeReport.id,
          standard: typeReport.standard
        }
      })
    }
  }
}
