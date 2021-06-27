<template>
  <v-data-table
    :headers="headers"
    :items="typesReports"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on">Добавить</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-card-text>
              <v-container>
                <v-col>
                  <v-text-field v-model="editedItem.title" label="Название"></v-text-field>
                  <v-select label="Стандарт" v-model="editedItem.standard" :items="standards"></v-select>
                </v-col>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="close">Отмена</v-btn>
              <v-btn @click="save">Сохранить</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.standard="{ value }">
      {{ findBy(value, standards, "value").text }}
    </template>
    <template v-slot:item.action="{ item }">
      <v-btn icon @click="editItem(item)">
        <v-icon small>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon @click="deleteItem(item)">
        <v-icon small>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
  import {ADMIN_TYPES_REPORTS} from "../../../assets/js/constants/breadcrumbs";
  import {
    createTypeReport,
    deleteTypeReport,
    findAllTypesReports,
    saveTypeReport
  } from "../../../assets/js/API/typeReport";
  import {findBy} from "../../../components/mixins/utils";
  import {standards} from "../../../components/mixins/options";

  export default {
    mixins: [findBy, standards],
    data() {
      return {
        dialog: false,
        headers: [
          { text:"Наименование", value:"title" },
          { text:"Стандарт отчетности", value:"standard" },
          { text: 'Действия', value: 'action', sortable: false }
        ],
        editedIndex: -1,
        editedItem: {
          id: undefined,
          title: "",
          standard: ""
        },
        defaultItem: {
          id: undefined,
          title: "",
          standard: ""
        },
      }
    },
    async asyncData({$axios, store}) {
      store.commit('breadcrumbs/set', ADMIN_TYPES_REPORTS)
      let responseTypesReports = await findAllTypesReports($axios)
      return {
        typesReports: responseTypesReports.data
      }
    },
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Новый тип отчета' : 'Редактирование'
      }
    },
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    methods: {
      editItem(item) {
        this.editedIndex = this.typesReports.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem(item) {
        const index = this.typesReports.indexOf(item)
        let answer = confirm("Вы уверены, что хотите удалить тип отчета: " + item.title + "?")
        if (answer) {
          deleteTypeReport(this.$axios, item.id)
            .then((response) => {
              this.typesReports.splice(index, 1)
            })
        }
      },
      close() {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      async save() {
        if (this.editedIndex > -1) {
          let responseTypeReport = await saveTypeReport(this.$axios, this.editedItem)
          Object.assign(this.typesReports[this.editedIndex], responseTypeReport.data)
        } else {
          let responseTypeReport = await createTypeReport(this.$axios, this.editedItem)
          this.typesReports.push(responseTypeReport.data)
        }
        this.close()
      },
    }
  }
</script>

<style scoped>

</style>
