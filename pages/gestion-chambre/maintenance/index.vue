<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Maintenance
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-gestion-chambre :modules="modules" />
            </v-col>
            <v-col cols="12" sm="6" md="9"></v-col>
          </v-row>
        </v-card-text>
        <v-card-actions> </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import SideGestionChambre from '~/components/gestion-chambre/SideGestionChambre.vue'

export default {
  components: { SideGestionChambre },
  computed: {
    modules() {
      return this.$store.state.modules
    },
  },
}
</script>

<style></style>
