import { OPTIONS_STANDARD } from '~/assets/js/constants/options';

export const selectOptionsAny = (items, blank = false, titleBlank = "Выберите значение") => {
  let options = items.map((item) => {
    return {
      value: item.id,
      text: item.title
    }
   })
  addBlank(options, blank, titleBlank)
  return options
}

export const selectOptionsTypeReport = (typesReports, blank = false, titleBlank = "Выберите тип отчета") => {
  let options = typesReports.map((typeReport) => {
    return {
      value: typeReport.id,
      text: textTypeReport(typeReport)
    }
  })
  addBlank(options, blank, titleBlank)
  return options
}

export const textTypeReport = (typeReport) => {
  return typeReport.title + ' (' + OPTIONS_STANDARD.find(standard => standard.value === typeReport.standard).text  + ')'
}

export const selectOptionsGroupParameters = (groups, typesReports, blank = false, titleBlank = "Выберите группу параметров") => {
  let options = groups.map((group) => {
      let typeReport = typesReports.find(type => type.id === group.typeReportId)
      let standard = OPTIONS_STANDARD.find(standard => standard.value === typeReport.standard).text
      return {
        value: group.id,
        text: typeReport.title + " (" + standard + ") - " + group.title
      }
    }
  )
  addBlank(options, blank, titleBlank)
  return options
}

export const selectOptions = {
  any: selectOptionsAny,
  typeReport: selectOptionsTypeReport,
  groupParameters: selectOptionsGroupParameters
}

export default {
  selectOptions: selectOptions
}

const addBlank = (items, blank, titleBlank) => {
  if(blank) {
    items.unshift({
      value: undefined,
      text: titleBlank
    })
  }
}
