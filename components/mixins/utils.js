const format = "YYYY-MM-DD"

export const findBy = {
  methods: {
    findBy(value, items, prop = "id") {
      let item = items.find(item => item[prop] === value)
      if(item === undefined) {
        return "Not found"
      } else {
        return item
      }
    }
  }
}

export const getStartPeriod = {
  methods: {
    getStartPeriod(type, startPeriod) {
      switch (type) {
        case "DATE":
          return startPeriod
        case "MONTH":
          return this.$moment(startPeriod, format).startOf("month").format(format)
        case "QUARTER":
          return this.$moment(startPeriod, format).startOf("quarter").format(format)
        case "HALFYEAR":
          let firstHalfYear = this.$moment(startPeriod, format).month() < 6
          console.log(this.$moment(startPeriod, format).month())
          console.log(firstHalfYear)
          return this.$moment(startPeriod, format).startOf("year").add(firstHalfYear ? 0 : 6, "month").format(format)
        case "NINEMONTHS":
        case "TWELVEMONTHS":
          return this.$moment(startPeriod, format).startOf("year").format(format)


        default:
          return ""
      }
    }
  }
}

export const getEndPeriod = {
  methods: {
    getEndPeriod(type, startPeriod) {
      switch (type) {
        case "DATE":
          return startPeriod
        case "MONTH":
          return this.$moment(startPeriod, "YYYY-MM-DD").endOf("month").format("YYYY-MM-DD")
        case "QUARTER":
          return this.$moment(startPeriod, "YYYY-MM-DD").add(2, "month").endOf("month").format("YYYY-MM-DD")
        case "HALFYEAR":
          return this.$moment(startPeriod, "YYYY-MM-DD").add(5, "month").endOf("month").format("YYYY-MM-DD")
        case "NINEMONTHS":
          return this.$moment(startPeriod, "YYYY-MM-DD").add(8, "month").endOf("month").format("YYYY-MM-DD")
        case "TWELVEMONTHS":
          return this.$moment(startPeriod, "YYYY-MM-DD").add(11, "month").endOf("month").format("YYYY-MM-DD")
        default:
          return ""
      }
    }
  }
}

export const filterBy = {
  methods: {
    filterBy(value, itemsName, prop = "id") {
      return this[itemsName].filter(item => item[prop] === value)
    }
  }
}

export const isEmpty = {
  methods: {
    isEmpty(value) {
      return value === null || value === undefined
    }
  }
}

export const getTextPeriod = {
  methods: {
    getTextPeriod(value) {
      if (value !== null) {
        let months = [
          { value: "JAN", text: "Январь " },
          { value: "FEB", text: "Февраль " },
          { value: "MAR", text: "Март " },
          { value: "APR", text: "Апрель " },
          { value: "MAY", text: "Май " },
          { value: "JUN", text: "Июнь " },
          { value: "JUL", text: "Июль " },
          { value: "AUG", text: "Август " },
          { value: "SEP", text: "Сентябрь " },
          { value: "OCT", text: "Октябрь " },
          { value: "NOV", text: "Ноябрь " },
          { value: "DEC", text: "Декабрь " }
        ]
        if (value.includes("M")) {
          console.log("M")
          let text
          if (value[0] === "3") {
            text = " месяца "
          } else {
            text = " месяцев "
          }
          value = value.replace("M", text)
        }
        if (value.includes("Q")) {
          value = value.replace("Q"," квартал " )
        }
        if (value.includes("H")) {
          value = value.replace("H"," полугодие " )
        }
        for (let i = 0; i < 12; i++) {
          if (value.includes(months[i].value)) {
            value = value.replace(months[i].value,months[i].text)
            break
          }
        }

        if (value.length == 8) {
          value = this.$moment(value, "DDMMYYYY").format("DD MMMM YYYY")
        }
        value += " г."
      }
      return value
    }
  }
}
