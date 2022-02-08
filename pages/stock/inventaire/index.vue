<template>
  <v-card elevation="2" shaped tile>
    <v-card-title class="headline grey lighten-1 primary--text">
      Inventaire stock général
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <side-stock />
        </v-col>
        <v-col cols="12" sm="6" md="9">
          <v-data-table
            no-data-text="Inventaire vide"
            :loading="$fetchState.pending"
            loading-text="En chargement ..."
            :headers="headers"
            :items="disponibles"
            :search="search"
            :items-per-page="10"
          >
            <template #[`top`]>
              <v-toolbar flat>
                <v-btn
                  class="ml-2"
                  :disabled="disponibles.length === 0"
                  dark
                  color="primary"
                  @click="print"
                >
                  <v-icon left>mdi-printer</v-icon>
                  IMPRIMER
                </v-btn>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="recherche ..."
                  single-line
                  hide-details
                ></v-text-field>
              </v-toolbar>
            </template>
            <template #[`item.disponible`]="{ item }">
              {{ item.disponible + ' ' + item.mesure }}
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions> </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import printjs from 'print-js'
import SideStock from '~/components/stock/SideStock.vue'
export default {
  components: {
    SideStock,
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Description', value: 'nom' },
        { text: 'Disponible', value: 'disponible' },
      ],
    }
  },
  fetch() {
    this.getInventaire()
  },
  computed: {
    ...mapGetters('stock/article', ['disponibles']),
  },
  methods: {
    ...mapActions({ getInventaire: 'stock/article/getDisponibleStock' }),
    print() {
      const inventaire = this.disponibles.map((inventaire) => {
        return {
          nom: inventaire.nom,
          disponible: inventaire.disponible + inventaire.mesure,
        }
      })
      printjs({
        printable: inventaire,
        properties: [
          { field: 'nom', displayName: 'Description' },
          { field: 'disponible', displayName: 'Disponible' },
        ],
        type: 'json',
        header: `<center><h3>Inventaire de stock</h3>${this.$moment().format(
          'll'
        )}</center><br>`,
        css: [
          'https://cdnjs.cloudflare.com/ajax/libs/vuetify/3.0.0-alpha.11/vuetify.min.css',
        ],
        style: 'td {text-align: center }',
      })
    },
  },
}
</script>

<style></style>
