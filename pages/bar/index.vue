<template>
  <v-card elevation="2" shaped tile>
    <v-card-title class="headline grey lighten-1 primary--text">
      Acceuil du Bar
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <side-gestion-bar />
        </v-col>
        <v-col justify="center" align="center" cols="12" sm="6" md="9">
          Informations générales liées au Bar
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions> </v-card-actions>
  </v-card>
</template>

<script>
import SideGestionBar from '~/components/bar/SideGestionBar.vue'
export default {
  components: {
    SideGestionBar,
  },
}
</script>

<style></style>
