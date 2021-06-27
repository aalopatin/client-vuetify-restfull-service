export const dataReportViewerFromReport = {
  computed: {
    dataReportViewer() {
      return this.report.rows.map((row) => {
        let dataRow = {}
        dataRow.parameterId = row.parameterId
        dataRow.parameterTitle = row.parameterTitle
        dataRow[this.report.periodId] = row.value
        return dataRow
      })
    },
    periodsReportViewer() {
      return [this.report.periodId]
    }
  }
}
