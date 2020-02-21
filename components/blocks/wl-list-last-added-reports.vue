<template>
  <v-card>
<!--    <v-data-table-->
<!--      dense-->
<!--      height="500px"-->
<!--      :headers="headers"-->
<!--      :items="reports[options.page-1]"-->
<!--      :items-per-page="itemsPerPage"-->
<!--      :server-items-length="serverItemsLength"-->
<!--      :options.sync="options"-->
<!--      :loading="loading"-->
<!--      hide-default-footer-->
<!--    >-->
<!--      <template v-slot:item.createdOn="{ value }">-->
<!--        {{ $moment(value).format("DD.MM.YYYY") }}-->
<!--      </template>-->
<!--      <template v-slot:footer>-->
<!--        <v-container>-->
<!--          <v-row align="center" justify="center">-->
<!--            <v-btn-->
<!--              text-->
<!--              icon-->
<!--              @click="formerPage"-->
<!--            >-->
<!--              <v-icon>mdi-chevron-left</v-icon>-->
<!--            </v-btn>-->
<!--            <span-->
<!--              class="grey&#45;&#45;text"-->
<!--            >-->
<!--              {{ options.page }}-->
<!--            </span>-->
<!--            <v-btn-->
<!--              text-->
<!--              icon-->
<!--              @click="nextPage"-->
<!--            >-->
<!--              <v-icon>mdi-chevron-right</v-icon>-->
<!--            </v-btn>-->
<!--          </v-row>-->
<!--        </v-container>-->
<!--      </template>-->
<!--    </v-data-table>-->
    <v-data-iterator
      :items="reports[options.page - 1]"
      :items-per-page="itemsPerPage"
      :server-items-length="serverItemsLength"
      :options.sync="options"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar
          dense
          flat
        >
          <v-toolbar-title class="body-1">Последние загруженные отчеты:</v-toolbar-title>
        </v-toolbar>

      </template>
      <template v-slot:default="{ items }">
        <v-list
          min-height="500px"
          class="py-0"
        >

          <v-list-item
            dense
            v-for="report in items"
            :key="report.id"
            nuxt
            :to="/reports/ + report.id"
          >
            <v-list-item-content class="pa-1">
              <p>
                <v-icon v-if="lessThanDayAgo(report.createdOn)" color="red">mdi-new-box</v-icon>
                <b>{{report.companyTitle }}:</b> {{ report.typeReportTitle + ' - ' + getTextPeriod(report.periodId) }}
              </p>
              <v-list-item-subtitle>
                Добавлен: {{$moment(report.createdOn).fromNow()}}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
      <template v-slot:no-data>
        <v-alert height="500px"></v-alert>
      </template>
      <template v-slot:footer>
        <v-container>
          <v-row align="center" justify="center">
            <v-btn
              text
              icon
              @click="formerPage"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <span
              class="grey--text"
            >
              {{ options.page }}
            </span>
            <v-btn
              text
              icon
              @click="nextPage"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </template>
    </v-data-iterator>
  </v-card>
</template>

<script>
  import {findAllReports} from "../../assets/js/API/report";
  import {getTextPeriod} from "../mixins/utils";

  export default {
    name: "wl-list-last-added-reports",
    mixins: [getTextPeriod],
    data() {
      return {
        reports: [],
        serverItemsLength: 0,
        pages: 0,
        pagesLoaded: 0,
        loading: true,
        options: {},
        itemsPerPage: 10,
        loaded: false,
        headers: [
          { text: "", value: "createdOn", width: 100 },
          { text: "Компания", value: "companyTitle" },
          { text: "Тип отчета", value: "typeReportTitle" },
          { text: "Период", value: "periodId" }
        ],

      }
    },
    mounted() {
      console.log("mounted")
      console.log(this.options)
      this.loaded = true
      this.loadReports()
    },
    watch: {
      options: {
        handler () {
          if (!this.loaded){
            console.log("watch")
            console.log(this.options)

            this.loadReports()
          }
          this.loaded = !this.loaded
        },
        deep: true,
      },
    },
    methods:{
      loadReports() {
        console.log(this.pagesLoaded)
        console.log(this.options.page)
        if(this.pagesLoaded < this.options.page) {
          this.loading = true
          findAllReports(this.$axios, {page: this.options.page - 1, size: this.itemsPerPage, sortBy: "createdOn", direction: "DESC"})
            .then(response =>{
              if (this.serverItemsLength !== 0 && this.serverItemsLength !== response.data.total) {
                this.reports.splice(0, this.reports.length)
                this.options.page = 1
              } else {
                this.reports.splice(this.reports.length, 0, response.data.reports)
                this.pages = response.data.pages
                this.pagesLoaded = this.options.page
                this.serverItemsLength = response.data.total
              }
            })
            .finally(() => {
              this.loading = false
            })
        }

      },
      nextPage () {
        if (this.options.page + 1 <= this.pages) this.options.page += 1
      },
      formerPage () {
        if (this.options.page - 1 >= 1) this.options.page -= 1
      },
      lessThanDayAgo(value) {
        return (this.$moment() - this.$moment(value)) / (1000*3600) < 24
      }
    }
  }
</script>

<style scoped>

</style>

