<template>
   <v-data-table
    :headers="headers"
    :items="groupsItems"
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
                   <v-select label="Тип отчета" v-model="editedItem.typeReportId" :items="filterBy(editedItem.standard, 'typesReports', 'standard')" item-text="title" item-value="id"></v-select>
                   <v-checkbox label="Основная" v-model="editedItem.basic"></v-checkbox>
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
     <template v-slot:item.basic="{ value }">
       <v-icon v-if="value">mdi-check</v-icon>
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
  import {ADMIN_GROUPS_PARAMETERS} from "../../../assets/js/constants/breadcrumbs";
  import {
    createGroupParameter,
    deleteGroupParameter,
    findAllGroupsParameters,
    saveGroupParameter
  } from "../../../assets/js/API/groupParameters";
  import {OPTIONS_STANDARD} from "../../../assets/js/constants/options";
  import {findAllTypesReports} from "../../../assets/js/API/typeReport";
  import {filterBy, findBy} from "../../../components/mixins/utils";
  import {groupsItems} from "../../../components/mixins/tables";

  export default {
    mixins: [findBy, filterBy, groupsItems],
    data() {
      return {
        standards: OPTIONS_STANDARD,
        dialog: false,
        headers: [
          { text:"Наименование", value:"title" },
          { text:"Основная", value:"basic" },
          { text:"Тип отчета", value:"typeReportId" },
          { text:"Стандарт", value:"standard" },
          { text: 'Действия', value: 'action', sortable: false }
        ],
        editedIndex: -1,
        editedItem: {
          id: undefined,
          title: "",
          basic: false,
          typeReportId: undefined,
          standard: undefined
        },
        defaultItem: {
          id: undefined,
          title: "",
          basic: false,
          typeReportId: undefined,
          standard: undefined
        },
      }
    },
    async asyncData({$axios, store}) {
      store.commit('breadcrumbs/set', ADMIN_GROUPS_PARAMETERS)
      let responseGroupsParameters = await findAllGroupsParameters($axios)
      let responseTypesReports = await findAllTypesReports($axios)
      return {
        groups: responseGroupsParameters.data,
        typesReports: responseTypesReports.data,
      }

    },
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Новая группа показателей' : 'Редактирование'
      }
    },
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    methods: {
      editItem(item) {
        this.editedIndex = this.groupsItems.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem(item) {
        const index = this.groupsItems.indexOf(item)
        let answer = confirm("Вы уверены, что хотите удалить группу параметров: " + item.title + "?")
        if (answer) {
          deleteGroupParameter(this.$axios, item.id)
            .then((response) => {
              this.groups.splice(index, 1)
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
          let responseGroup = await saveGroupParameter(this.$axios, this.editedItem)
          Object.assign(this.groups[this.editedIndex], responseGroup.data)
        } else {
          let responseGroup = await createGroupParameter(this.$axios, this.editedItem)
          this.groups.push(responseGroup.data)
        }
        this.close()
      },
      changeStandard() {
        this.editedItem.typeReportId = undefined
      },
    }
  }
</script>

<style scoped>

</style>
