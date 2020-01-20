export const OPTIONS_TYPE_PERIOD = [
  {value: "DATE", text: "Дата"},
  {value: "MONTH", text: "Месяц"},
  {value: "TREEMONTHS", text: "Три месяца(первый квартал)"},
  {value: "SIXMONTHS", text: "Шесть месяцев(первое полугодие)"},
  {value: "NINEMONTHS", text: "Девять месяцев"},
  {value: "TWELVEMONTHS", text: "Двенадцать месяцев(год)"},
  {value: "QUARTER", text: "Квартал"},
  {value: "HALFYEAR", text: "Полугодие(второе полугодие)"}
]

export const OPTIONS_STANDARD = [
  {value: "RSBU", text: "РСБУ"},
  {value: "IFRS", text: "МСФО"},
  {value: "GAAP", text: "US GAAP"},
  {value: "OTHER", text: "прочее"}
]

export const OPTIONS_MULTIPLICITY = [
  {value: 1, text: ""},
  {value: 1000, text: "тыс."},
  {value: 1000000, text: "млн."},
  {value: 1000000000, text: "млрд."}
]

export const OPTIONS_CURRENCY = [
  {value: "RUB", text: "руб."},
  {value: "USD", text: "долл."}
]
