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
            <v-col cols="12" sm="6" md="2">
              <side-maintenance />
            </v-col>
            <v-col justify="center" align="center" cols="12" sm="6" md="10">
              Informations générales la maintenance
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import SideMaintenance from '~/components/maintenance/SideMaintenance.vue'

export default {
  components: { SideMaintenance },
}
</script>

<style></style>
