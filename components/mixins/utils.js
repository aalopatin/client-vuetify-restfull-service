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
      console.log(type)
      console.log(startPeriod)
      switch (type) {
        case "DATE":
          return startPeriod
        case "MONTH":
          return this.$moment(startPeriod, "YYYY-MM-DD").startOf("month").format("YYYY-MM-DD")
        case "TREEMONTHS":
        case "SIXMONTHS":
        case "NINEMONTHS":
        case "TWELVEMONTHS":
          return this.$moment(startPeriod, "YYYY-MM-DD").startOf("year").format("YYYY-MM-DD")
        case "QUARTER":
          return this.$moment(startPeriod, "YYYY-MM-DD").startOf("quarter").format("YYYY-MM-DD")
        case "HALFYEAR":
          return this.$moment(startPeriod, "YYYY-MM-DD").startOf("year").add(6, "month").format("YYYY-MM-DD")
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
        case "TREEMONTHS":
        case "QUARTER":
          return this.$moment(startPeriod, "YYYY-MM-DD").add(2, "month").endOf("month").format("YYYY-MM-DD")
        case "SIXMONTHS":
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
