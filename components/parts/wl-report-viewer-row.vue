<template>
  <tr>
    <td>{{row.parameterId}}</td>
    <td v-for="period in periods">{{getValueParameter(period)}}</td>
  </tr>
</template>

<script>
  import {findBy, isEmpty} from "../mixins/utils";

  export default {
    name: "wl-report-viewer-row",
    props: {
      row: {
        type: Object
      },
      periods: {
        type: Array
      },
      data: {
        type: Array
      }
    },
    methods: {
      getValueParameter(period) {
        let dataRow = findBy(this.row.parameterId, this.data, "parameterId")
        if(!isEmpty(dataRow)) {
          return dataRow[period]
        } else {
          return null
        }
      }
    }
  }
</script>

<style scoped>

</style>
