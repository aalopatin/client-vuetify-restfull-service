<template>
<!--  <div>-->
<!--    <pre>-->
<!--      Данные-->
<!--      {{data}}-->
<!--    </pre>-->
<!--    <pre>-->
<!--      Периоды-->
<!--      {{periods}}-->
<!--    </pre>-->
<!--    <pre>-->
<!--      Настройка-->
<!--      {{setting}}-->
<!--    </pre>-->
<!--  </div>-->
<!--    <table>-->
<!--      <thead>-->
<!--        <tr>-->
<!--          <th></th>-->
<!--          <th v-for="period in periods">{{getTextPeriod(period)}}</th>-->
<!--        </tr>-->
<!--      </thead>-->
<!--      <tbody>-->
<!--        <wl-report-viewer-row v-for="row in setting.rows" :data="data" :periods="periods" :row="row"></wl-report-viewer-row>-->
<!--      </tbody>-->
<!--    </table>-->
  <v-data-table
    dense
    :headers="headers"
    :items="items"
    hide-default-footer
    disable-pagination
    disable-sort
    disable-filtering
  >
<!--    <template v-slot:item="props">-->
<!--      <tr>-->
<!--        <td v-for="header in props.headers" :class="headers.class" :class="props.item.font">-->
<!--            {{ props.item[header.value] }}-->
<!--        </td>-->
<!--      </tr>-->
<!--    </template>-->
    <template v-slot:item.title="props">
      <span :class="props.item.font">
        {{ props.value }}
      </span>
    </template>
    <template v-slot:[nameSlotItemHeader(period)]="props" v-for="period in periods">
      <span :class="props.item.font">
        {{ props.value }}
      </span>
    </template>
  </v-data-table>
</template>

<script>
  import {getTextPeriod, isEmpty} from "../mixins/utils";
  import WlReportViewerRow from "./wl-report-viewer-row";

  export default {
    name: "wl-report-viewer",
    components: {WlReportViewerRow},
    mixins: [getTextPeriod, isEmpty],
    props: {
      data: {
        type: Array
      },
      periods: {
        type: Array
      },
      setting: {
        type: Object,
        default: {
          rows: []
        }
      },
    },
    // data() {
    //   return {
    //     data: [
    //       {parameterId: 1, parameterTitle: 'Основные средства', '3M2020': 1000, '6M2020': 1000, '9M2020': 1000, '12M2020': 1000, '3M2019': 1000, '6M2019': 1000, '9M2019': 1000, '12M2019': 1000},
    //       {parameterId: 2, parameterTitle: 'Нематериальные активы', '3M2020': 1100, '6M2020': 1100, '9M2020': 1100, '12M2020': 1100, '3M2019': 1000, '6M2019': 1000, '9M2019': 1000, '12M2019': 1000},
    //       {parameterId: 3, parameterTitle: 'Итого внеоборотные активы', '3M2020': 1200, '6M2020': 1200, '9M2020': 1200, '12M2020': 1200, '3M2019': 1000, '6M2019': 1000, '9M2019': 1000, '12M2019': 1000},
    //       {parameterId: 4, parameterTitle: 'Запасы', '3M2020': 1300, '6M2020': 1300, '9M2020': 1300, '12M2020': 1300, '3M2019': 1000, '6M2019': 1000, '9M2019': 1000, '12M2019': 1000},
    //       {parameterId: 5, parameterTitle: 'Денежные средства', '3M2020': 1400, '6M2020': 1400, '9M2020': 1400, '12M2020': 1400, '3M2019': 1000, '6M2019': 1000, '9M2019': 1000, '12M2019': 1000},
    //       {parameterId: 6, parameterTitle: 'Итого оборотные активы', '3M2020': 1500, '6M2020': 1500, '9M2020': 1500, '12M2020': 1500, '3M2019': 1000, '6M2019': 1000, '9M2019': 1000, '12M2019': 1000},
    //       {parameterId: 7, parameterTitle: 'Итого активы', '3M2020': 1600, '6M2020': 1600, '9M2020': 1600, '12M2020': 1600, '3M2019': 1000, '6M2019': 1000, '9M2019': 1000, '12M2019': 1000},
    //     ],
    //     setting: {
    //       rows: [
    //         {typeRow: 'HEADER', parameterId: null, title: 'АКТИВЫ', fontStyle: "font-weight-bold", fontSize: null},
    //         {typeRow: 'HEADER', parameterId: null, title: 'Внеоборотные активы', fontStyle: "font-weight-bold", fontSize: null},
    //         {typeRow: 'PARAMETER', parameterId: 1, title: null, fontStyle: null, fontSize: null},
    //         {typeRow: 'PARAMETER', parameterId: 2, title: null, fontStyle: null, fontSize: null},
    //         {typeRow: 'PARAMETER', parameterId: 3, title: null, fontStyle: null, fontSize: null},
    //         {typeRow: 'SEPARATOR', parameterId: null, title: null, fontStyle: null, fontSize: null},
    //         {typeRow: 'HEADER', parameterId: null, title: 'Оборотные активы', fontStyle: "font-weight-bold", fontSize: null},
    //         {typeRow: 'PARAMETER', parameterId: 4, title: null, fontStyle: null, fontSize: null},
    //         {typeRow: 'PARAMETER', parameterId: 5, title: null, fontStyle: null, fontSize: null},
    //         {typeRow: 'PARAMETER', parameterId: 6, title: null, fontStyle: "font-weight-bold", fontSize: null},
    //         {typeRow: 'PARAMETER', parameterId: 7, title: null, fontStyle: "font-weight-bold", fontSize: null},
    //       ]
    //     },
    //     periods: [ "3M2019", "6M2019", "9M2019", "12M2019", "3M2020", "6M2020", "9M2020", "12M2020" ],
    //   }
    // },
    computed: {
      headers() {
        return [
          { text: "", value: "title"},
          ...this.periods.map((period) => {
            return {
              // text: this.getTextPeriod(period),
              text: period,
              value: period,
              align: "right"
            }
          })
        ]
      },
      items() {
        let items = []
        this.setting.rows.forEach((row) => {
          let dataRow = null
          if (!this.isEmpty(row.typeRow === "PARAMETER")) {
            dataRow = this.data.find((dataRow) => dataRow.parameterId === row.parameterId )
            if (this.isEmpty(dataRow)) {
              return
            }
          } else {
            dataRow = {}
            dataRow.parameterTitle = null
            this.periods.forEach((period) => {
              dataRow[period] = null
            })
          }

          let font = ""
          if (!this.isEmpty(row.fontStyle)) {
            font = row.fontStyle
          }
          if (this.isEmpty(row.fontSize)) {
            if (font.length != 0) {
              font = font.concat(" ")
            }
            font.concat(row.fontSize)
          }
          let item = {
            title: this.isEmpty(row.title) ? dataRow.parameterTitle : row.title,
            font: font
          }
          this.periods.forEach((period) => {
            item[period] = parseFloat(dataRow[period].toFixed(0)).toLocaleString()
          })
          items.push(item)
         })
        return items
      }
    },
    methods: {
      nameSlotItemHeader(header) {
        return "item." + header
      },
    }

  }
</script>

<style scoped>
  .table td tr {
    border: 10px solid black;
  }
</style>
