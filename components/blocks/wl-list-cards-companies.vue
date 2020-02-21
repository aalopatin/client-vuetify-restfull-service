<template>
  <v-card>
    <v-data-iterator
      :items="companies"
      :items-per-page.sync="itemsPerPage"
      :search="search"
      :page="page"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-col cols="5">
            <v-text-field
              v-model="search"
              clearable
              flat
              hide-details
              label="Поиск"
            ></v-text-field>
          </v-col>
        </v-toolbar>
      </template>
      <template v-slot:default="{ items }">
        <v-container>
          <v-row
            justify="center"
          >
              <v-card
                v-for="item in items"
                :key="item.id"
                hover
                width="250"
                height="350"
                nuxt
                :to="'/companies/' + item.id"
                class="ma-2"
              >
                <v-img
                  contain
                  height="150"
                  :src="item.logoURI !== null ? item.logoURI : ''"
                >
                </v-img>
                <v-card-title>{{item.title}}</v-card-title>
                <v-card-text >
                  <p class="block-with-text">{{item.description}}</p>
                </v-card-text>
              </v-card>
          </v-row>
        </v-container>
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
              {{ page }} из {{ numberOfPages }}
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
  import {findAllCompanies} from "../../assets/js/API/company";


  export default {
    name: "wl-list-cards-companies",
    data() {
      return {
        companies: [],
        search: '',
        page: 1
      }
    },
    computed: {
      itemsPerPage() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 3
          case 'sm': return 9
          case 'md': return 9
          case 'lg': return 9
          case 'xl': return 12
        }
      },
      numberOfPages () {
        return Math.ceil(this.companies.length / this.itemsPerPage)
      },
    },
    mounted() {
      findAllCompanies(this.$axios)
        .then(response =>{
          this.companies = response.data
          this.companies.forEach(company => {
            if (company.description !== null) {
              company.description = company.description.slice(0, 120)  + "..."
            } else {
              company.description = "..."
            }

          })
        })
    },
    methods:{
      nextPage () {
        if (this.page + 1 <= this.numberOfPages) this.page += 1
      },
      formerPage () {
        if (this.page - 1 >= 1) this.page -= 1
      },
    }
  }
</script>

<style scoped>

</style>
