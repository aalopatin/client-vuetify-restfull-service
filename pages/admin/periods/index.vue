<template>
  <v-data-table
    :headers="headers"
    :items="periods"
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
                  <v-select label="Тип периода" v-model="editedItem.type" :items="typesPeriods"></v-select>
                  <v-dialog
                    v-model="startPeriodPicker"
                    width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="editedItem.startPeriod"
                        label="Начало периода"
                        prepend-icon="mdi-calendar"
                        readonly
                        :disabled="editedItem.type === ''"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="editedItem.startPeriod" @input="setPeriod"></v-date-picker>
                  </v-dialog>
                  <v-text-field
                    v-model="editedItem.endPeriod"
                    label="Конец периода"
                    prepend-icon="mdi-calendar"
                    readonly
                  ></v-text-field>
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
    <template v-slot:item.startPeriod="{ value }">
      {{ $moment(value, "YYYY-MM-DD").format("DD.MM.YYYY") }}
    </template>
    <template v-slot:item.endPeriod="{ value }">
      {{ $moment(value, "YYYY-MM-DD").format("DD.MM.YYYY") }}
    </template>
    <template v-slot:item.type="{ value }">
      {{ findBy(value, typesPeriods, "value").text }}
    </template>
    <template v-slot:item.action="{ item }">
      <v-btn icon @click="deleteItem(item)">
        <v-icon small>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
  import {ADMIN_PERIODS} from "../../../assets/js/constants/breadcrumbs";
  import {createPeriod, deletePeriod, findAllPeriods, savePeriod} from "../../../assets/js/API/period";
  import {findBy, getEndPeriod, getStartPeriod} from "../../../components/mixins/utils";
  import {OPTIONS_TYPE_PERIOD} from "../../../assets/js/constants/options";

  export default {
    mixins: [findBy, getEndPeriod, getStartPeriod],
    data() {
      return {
        typesPeriods: OPTIONS_TYPE_PERIOD,
        dialog: false,
        startPeriodPicker: false,
        headers: [
          { text:"#", value:"id" },
          { text:"Начало", value:"startPeriod" },
          { text:"Окончание", value:"endPeriod" },
          { text:"Тип периода", value:"type" },
          { text: 'Действия', value: 'action', sortable: false }
        ],
        editedIndex: -1,
        editedItem: {
          id: undefined,
          startPeriod: "",
          endPeriod: "",
          type: ""
        },
        defaultItem: {
          id: undefined,
          startPeriod: "",
          endPeriod: "",
          type: ""
        },
      }
    },
    async asyncData({$axios, store}) {
      store.commit('breadcrumbs/set', ADMIN_PERIODS)
      let responsePeriods = await findAllPeriods($axios)

      return {
        periods: responsePeriods.data
      }
    },
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Новый период' : 'Редактирование'
      }
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
      "editedItem.type": function() {
        if(this.editedItem.startPeriod !== "") {
          this.editedItem.startPeriod = this.getStartPeriod(this.editedItem.type, this.editedItem.startPeriod)
          this.editedItem.endPeriod = this.getEndPeriod(this.editedItem.type, this.editedItem.startPeriod)
        }
      }
    },
    methods: {
      deleteItem(item) {
        const index = this.periods.indexOf(item)
        let answer = confirm("Вы уверены, что хотите удалить период: " + item.id + "?")
        if(answer) {
          deletePeriod(this.$axios, item.id)
            .then((response) => {
              this.periods.splice(index, 1)
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
          let responsePeriod = await savePeriod(this.$axios, this.editedItem)
          Object.assign(this.periods[this.editedIndex], responsePeriod.data)
        } else {
          let responsePeriod = await createPeriod(this.$axios, this.editedItem)
          this.periods.push(responsePeriod.data)
        }
        this.close()
      },
      setPeriod() {
        this.editedItem.startPeriod = this.getStartPeriod(this.editedItem.type, this.editedItem.startPeriod)
        this.editedItem.endPeriod = this.getEndPeriod(this.editedItem.type, this.editedItem.startPeriod)
        this.startPeriodPicker = false
      }
    },
  }
</script>

<style scoped>

</style>
