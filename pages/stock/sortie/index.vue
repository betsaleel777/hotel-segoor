<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Sortie de Stock
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-stock />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-data-table
                no-data-text="Aucune Sortie de stock"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="sorties"
                :search="search"
                :items-per-page="10"
              >
                <template #[`top`]>
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="recherche ..."
                    single-line
                    hide-details
                  ></v-text-field>
                </template>
                <template #[`item.actions`]="{ item }">
                  <show-sortie :item="item" />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions> </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
/* eslint-disable camelcase */
import SideStock from '~/components/stock/SideStock.vue'
import ShowSortie from '~/components/stock/sortie/ShowSortie.vue'

export default {
  components: {
    SideStock,
    ShowSortie,
  },
  data() {
    return {
      search: '',
      sorties: [],
      headers: [
        { text: 'Code', value: 'code', sortable: false },
        { text: 'Titre', value: 'titre', sortable: false },
        { text: 'Demandé le', value: 'demande_le' },
        { text: 'livré le', value: 'created_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    const calebasse = await this.$axios.get('stock/sorties')
    const sorties = calebasse.data.sorties.map((sortie) => {
      const { id, code, titre, created_at, produits, demande_linked } = sortie
      return {
        id,
        titre,
        code,
        status,
        created_at: this.$moment(created_at).format('ll'),
        demande_le: this.$moment(demande_linked.created_at).format('ll'),
        produits,
      }
    })
    this.sorties = sorties
  },
}
</script>

<style></style>
