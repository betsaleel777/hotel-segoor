<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Inventaire
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-stock />
            </v-col>
            <v-col cols="9">
              <v-data-table
                no-data-text="Aucun achat éffectué"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="achats"
                :search="search"
                :items-per-page="10"
              >
                <template #[`top`]>
                  <v-toolbar flat>
                    <create-achat
                      :floating="false"
                      :produits="produits"
                      @new-achat="pushAchat"
                    />
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
                <template #[`item.quantite`]="{ item }">
                  {{ item.quantite + ' ' }}{{ item.mesure }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <v-tooltip top>
                    <template #activator="{ on: tooltip }">
                      <v-btn
                        :to="'/stock/achat/' + item.id"
                        color="pink"
                        elevation="1"
                        icon
                        fab
                        dark
                        x-small
                        v-on="{ ...tooltip }"
                        ><v-icon small> mdi-eye</v-icon></v-btn
                      >
                    </template>
                    <span>visualiser achats</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <create-achat :produits="produits" @new-achat="pushAchat" />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import CreateAchat from '~/components/stock/achat/CreateAchat.vue'
import SideStock from '~/components/stock/SideStock'
export default {
  components: {
    SideStock,
    CreateAchat,
  },
  data() {
    return {
      search: '',
      produits: [],
      achats: [],
      headers: [
        { text: 'Description', value: 'nom' },
        { text: 'Disponible', value: 'quantite' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    let calebasse = await this.$axios.get('stock/produits')
    const produits = calebasse.data.produits.map((produit) => {
      return {
        id: produit.id,
        mesure: produit.mesure,
        nom: produit.nom,
        type: produit.type,
      }
    })
    calebasse = await this.$axios.get('stock/achats')
    const achats = calebasse.data.achats.map((achat) => {
      return {
        id: achat.produit,
        code: achat.code,
        quantite: achat.quantite,
        nom: achat.nom,
        mesure: achat.mesure,
      }
    })
    this.achats = achats
    this.produits = produits
  },
  methods: {
    pushAchat(achat) {
      const index = this.achats.findIndex(
        (element) => element.id === achat.ingredient
      )
      this.achats[index].quantite =
        Number(this.achats[index].quantite) + Number(achat.quantite)
    },
  },
}
</script>

<style></style>
