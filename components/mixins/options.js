export const typesPeriods = {
  data() {
    return {
      typesPeriods: [
        {value: "DATE", text: "Дата"},
        {value: "MONTH", text: "Месяц"},
        {value: "QUARTER", text: "Три месяца(квартал)"},
        {value: "HALFYEAR", text: "Шесть месяцев(полугодие)"},
        {value: "NINEMONTHS", text: "Девять месяцев"},
        {value: "TWELVEMONTHS", text: "Двенадцать месяцев(год)"}
      ]
    }
  }
}

export const standards = {
  data() {
    return {
      standards: [
        {value: "RSBU", text: "РСБУ"},
        {value: "IFRS", text: "МСФО"},
        {value: "GAAP", text: "US GAAP"},
        {value: "OTHER", text: "прочее"}
      ]
    }
  }
}

export const typesRowsSettingReport = {
  data() {
    return {
      typesRowsSettingReport: [
        {value: "PARAMETER", text: "Параметр"},
        {value: "HEADER", text: "Заголовок"},
        {value: "SEPARATOR", text: "Разделитель"},
      ]
    }
  }
}
export const multiplicities = {
  data() {
    return {
      multiplicities: [
        {value: 1, text: ""},
        {value: 1000, text: "тыс."},
        {value: 1000000, text: "млн."},
        {value: 1000000000, text: "млрд."}
      ]
    }
  }
}

export const currencies = {
  data() {
    return {
      currencies: [
        {value: "RUB", text: "руб."},
        {value: "USD", text: "долл."}
      ]
    }
  }
}

export const fontStyles = {
  data() {
    return {
      fontStyles: [
        {value: "font-regular", text: "Regular 10sp"},
        {value: "font-weight-light", text: "Condensed Light"},
        {value: "font-weight-thin", text: "Thin"},
        {value: "font-weight-regular", text: "Regular"},
        {value: "font-weight-medium", text: "Medium"},
        {value: "font-weight-bold", text: "Bold"},
        {value: "font-weight-black", text: "Black"},
        {value: "font-italic", text: "Italic"},
        {value: "font-italic font-weight-light", text: "Light italic"},
        {value: "font-italic font-weight-medium", text: "Medium italic"},
        {value: "font-italic font-weight-bold", text: "Bold italic"}
      ]
    }
  }
}

export const fontSizes = {
  data() {
    return {
      fontSizes: [
        {value: "display-4", text: "Light 96sp"},
        {value: "display-3", text: "Light 60sp"},
        {value: "display-2", text: "Regular 48sp"},
        {value: "display-1", text: "Regular 34sp"},
        {value: "headline", text: "Regular 24sp"},
        {value: "title", text: "Medium 20sp"},
        {value: "subtitle-1", text: "Regular 16sp"},
        {value: "subtitle-2", text: "Medium 14sp"},
        {value: "body-1", text: "Regular 16sp"},
        {value: "body-2", text: "Regular 14sp"},
        {value: "caption", text: "Regular 12sp"},
        {value: "overline", text: "REGULAR 10SP"}
      ]
    }
  }
}
