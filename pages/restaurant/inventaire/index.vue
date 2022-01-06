<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Inventaire du Restaurant
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-restaurant />
            </v-col>
            <v-col cols="9">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-data-table
                    no-data-text="Inventaire vide"
                    :loading="$fetchState.pending"
                    loading-text="En chargement ..."
                    :headers="headers"
                    :items="lignes"
                    :search="search"
                    :items-per-page="10"
                  >
                    <template #[`top`]>
                      <v-toolbar flat>
                        <v-btn
                          class="ml-2"
                          :disabled="lignes.length === 0"
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
                    <template #item="{ item, expand, isExpanded }">
                      <tr :class="colorize(item)">
                        <td>
                          {{ item.nom }}
                        </td>
                        <td>
                          {{ item.disponible.toFixed(2) + ' ' }}
                          <span v-if="!item.contenance">{{ item.mesure }}</span>
                          <span v-else>Bouteilles</span>
                        </td>
                        <td>
                          <v-tooltip right>
                            <template #activator="{ on: tooltip }">
                              <v-btn
                                v-if="item.reste !== 0"
                                small
                                v-on="{ tooltip }"
                                @click="expand(!isExpanded)"
                                ><v-icon left>mdi-information</v-icon
                                >détails</v-btn
                              >
                            </template>
                            <span>modifier</span>
                          </v-tooltip>
                        </td>
                      </tr>
                    </template>
                    <template #[`expanded-item`]="{ item }">
                      <td v-if="item.reste !== 0" :colspan="headers.length">
                        <p class="text-right primary--text">
                          quantité encore en bouteille {{ item.reste + '%' }}
                        </p>
                      </td>
                    </template>
                  </v-data-table>
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions> </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import printjs from 'print-js'
import SideRestaurant from '~/components/restaurant/SideRestaurant.vue'
export default {
  components: {
    SideRestaurant,
  },
  data() {
    return {
      search: '',
      lignes: [],
      headers: [
        { text: 'Description', value: 'nom' },
        { text: 'Disponible', value: 'disponible' },
        { text: 'en cours', value: 'reste' },
      ],
    }
  },
  async fetch() {
    let departement = null
    let requete = await this.$axios.get(
      'parametre/departements/' + 'restaurant'
    )
    departement = requete.data.departement
    requete = await this.$axios.get(
      'stock/demandes/inventaire/' + departement.id
    )
    const lignes = requete.data.inventaire.map((ligne) => {
      return {
        id: ligne.id,
        nom: ligne.nom,
        code: ligne.code,
        disponible: ligne.disponible,
        contenance: ligne.contenance,
        mesure: ligne.mesure,
      }
    })
    this.lignes = lignes
  },
  methods: {
    colorize(item) {
      return item.deleted_at ? 'archive-style' : null
    },
    print() {
      const inventaire = this.lignes.map((inventaire) => {
        return {
          nom: inventaire.nom,
          disponible: inventaire.disponible,
          reste: inventaire.reste,
        }
      })
      printjs({
        printable: inventaire,
        properties: [
          { field: 'nom', displayName: 'Description' },
          { field: 'disponible', displayName: 'Disponible' },
          { field: 'reste', displayName: 'En cours' },
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
