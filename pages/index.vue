<template>
  <v-col
    cols="12"
    lg="8"
  >
    <wl-list-last-added-reports></wl-list-last-added-reports>
    <v-divider class="mb-5"></v-divider>
    <wl-list-cards-companies></wl-list-cards-companies>
  </v-col>
</template>

<script>
import WlListCardsCompanies from "../components/blocks/wl-list-cards-companies";
import WlListLastAddedReports from "../components/blocks/wl-list-last-added-reports";

export default {
  components: {WlListLastAddedReports, WlListCardsCompanies},
}
</script>
