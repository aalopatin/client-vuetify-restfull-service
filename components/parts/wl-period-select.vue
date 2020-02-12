<template>

  <v-input
    :value="value"
    label="Периоды"
    hide-details
    :height="value.length === 0 ? '48px' : ''"
    :disabled="disabled"
    :rules="rules"
  >
    <draggable
      :value="value"
      column @input="input"
    >
      <v-chip v-for="period in value" :key="period" class="ma-1" close @click:close="closeChip(period)">{{ period }}</v-chip>
    </draggable>
    <template v-slot:append>
      <v-dialog v-model="dialog" max-width="700px">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" :disabled="disabled">
            <v-icon>mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Выбор периодов</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-autocomplete
                :value="value"
                :items="periods"
                :loading="isLoading"
                :search-input.sync="search"
                chips
                deletable-chips
                hide-no-data
                hide-selected
                item-value="id"
                item-text="id"
                multiple
                @input="input"
              ></v-autocomplete>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
  </v-input>
</template>

<script>
  import draggable from "vuedraggable";
  import {findAllPeriods} from "../../assets/js/API/period";

  export default {
    name: "wl-period-selection",
    components: { draggable },
    props: {
      value: {
        type: Array,
      },
      disabled: {
        type: Boolean
      },
      rules: {
        type: Array
      }
    },
    data() {
      return {
        dialog: false,
        periods: [],
        selectedPeriods: [],
        isLoading: false,
        search: null
      }
    },
    watch: {
      search (val) {
        // Items have already been loaded
        if (this.periods.length > 0) return

        // Items have already been requested
        if (this.isLoading) return

        this.isLoading = true

        // Lazily load input items
        findAllPeriods(this.$axios)
          .then(response => {
            this.periods = response.data
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoading = false))
      },
      value (val) {
        this.selectedPeriods.splice(0, this.selectedPeriods.length, ...val)
      }
    },
    methods: {
      input(event) {
        this.$emit('input', event)
      },
      closeChip(period) {
        this.value.splice(this.value.indexOf(period), 1)
      }
    }
  }
</script>

<style scoped>

</style>
