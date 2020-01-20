<template>
    <v-data-table
      :headers="headers"
      :items="parametersItems"
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
                    <v-select label="Стандарт" v-model="editedItem.standard" :items="standards" @change="changeStandard"></v-select>
                    <v-select label="Тип отчета" v-model="editedItem.typeReportId" :items="filterBy(editedItem.standard, 'typesReports', 'standard')" item-text="title" item-value="id" @change="changeTypeReport"></v-select>
                    <v-select label="Группа параметров" v-model="editedItem.groupId" :items="filterBy(editedItem.typeReportId, 'groups', 'typeReportId')" item-text="title" item-value="id" ></v-select>
                    <v-checkbox label="Кумулятивный" v-model="editedItem.cumulative"></v-checkbox>
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
      <template v-slot:item.cumulative="{ value }">
        <v-icon v-if="value">mdi-check</v-icon>
      </template>
      <template v-slot:item.groupId="{ value }">
        {{ findBy(value, groups).title }}
      </template>

      <template v-slot:item.typeReportId="{ value }">
        {{ findBy(value, typesReports).title }}
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
  import {OPTIONS_STANDARD} from "../../../assets/js/constants/options";
  import {ADMIN_PARAMETERS} from "../../../assets/js/constants/breadcrumbs";
  import {createParameter, deleteParameter, findAllParameters, saveParameter} from "../../../assets/js/API/parameter";
  import {findAllTypesReports} from "../../../assets/js/API/typeReport";
  import {findAllGroupsParameters} from "../../../assets/js/API/groupParameters";
  import {parametersItems} from "../../../components/mixins/tables";
  import {filterBy, findBy} from "../../../components/mixins/utils";

  export default {
    mixins: [findBy, filterBy, parametersItems],
    data() {
      return {
        standards: OPTIONS_STANDARD,
        dialog: false,
        headers: [
          { text:"Наименование", value:"title" },
          { text:"Кумулятивный", value:"cumulative" },
          { text:"Группа параметров", value:"groupId" },
          { text:"Тип отчета", value:"typeReportId" },
          { text:"Стандарт", value:"standard" },
          { text: 'Действия', value: 'action', sortable: false }
        ],
        editedIndex: -1,
        editedItem: {
          id: undefined,
          title: "",
          cumulative: false,
          groupId: undefined,
          typeReportId: undefined,
          standard: undefined
        },
        defaultItem: {
          id: undefined,
          title: "",
          cumulative: false,
          groupId: undefined,
          typeReportId: undefined,
          standard: undefined
        },
      }
    },
    async asyncData({$axios, store}) {

      store.commit('breadcrumbs/set', ADMIN_PARAMETERS)

      let responseParameters = await findAllParameters($axios)

      let responseTypesReports = await findAllTypesReports($axios)

      let responseGroupsParameters = await findAllGroupsParameters($axios)

      return {
        parameters: responseParameters.data,
        groups: responseGroupsParameters.data,
        typesReports: responseTypesReports.data,
      }
    },
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Новый показатель' : 'Редактирование'
      }
    },
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    methods: {
      editItem(item) {
        this.editedIndex = this.parametersItems.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem(item) {
        const index = this.parametersItems.indexOf(item)
        let answer = confirm("Вы уверены, что хотите удалить параметр: " + item.title + "?")
        if(answer) {
          deleteParameter(this.$axios, item.id)
            .then((response) => {
              this.parameters.splice(index, 1)
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
          let responseParameter = await saveParameter(this.$axios, this.editedItem)
          Object.assign(this.parameters[this.editedIndex], responseParameter.data)
        } else {
          let responseParameter = await createParameter(this.$axios, this.editedItem)
          this.parameters.push(responseParameter.data)
        }
        this.close()
      },
      changeStandard() {
        this.editedItem.typeReportId = undefined
        this.editedItem.groupId = undefined

      },
      changeTypeReport() {
        this.editedItem.groupId = undefined
      }
    }
  }
</script>

<style scoped>

</style>
