<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Les dépenses d'approvisionement {{ $moment(jour).format('ll') }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-stock />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-data-table
                no-data-text="Aucune dépense"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="achats"
                :search="search"
                :items-per-page="10"
              >
                <template #[`top`]>
                  <v-toolbar flat>
                    <v-btn
                      class="ml-2"
                      color="primary"
                      dark
                      :to="`/stock/achat/`"
                    >
                      <v-icon left>mdi-arrow-left-thick</v-icon>
                      retour
                    </v-btn>
                    <v-btn
                      class="ml-2"
                      :disabled="achats.length === 0"
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
                <template #[`item.montant`]="{ item }">
                  {{ item.montant | formater }}
                </template>
                <!-- <template #[`item.actions`]="{ item }">
                  <show-depense :id="item.id" />
                </template> -->
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions></v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import printjs from 'print-js'
import { mapGetters, mapActions } from 'vuex'
import { StockAchats } from '~/helper/permissions'
// import ShowDepense from '~/components/depense/ShowDepenseExterne.vue'
import SideStock from '~/components/stock/SideStock.vue'

export default {
  components: {
    // ShowDepense,
    SideStock,
  },
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  data() {
    return {
      search: '',
      permissions: {
        edit: StockAchats.modifier,
      },
      headers: [
        { text: 'Nom', value: 'nom' },
        { text: 'Montant', value: 'montant' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    const { params, store } = this.$nuxt.context
    this.jour = params.jour
    await store.dispatch('stock/achat/getByDate', {
      jour: params.jour,
    })
    await store.dispatch('produit/getProduits')
  },
  computed: {
    ...mapGetters({
      produits: 'stock/produit/produits',
      achats: 'stock/achat/achats',
    }),
  },
  methods: {
    ...mapActions('produit', ['getProduits']),
    print() {
      printjs({
        printable: this.achats,
        properties: [
          { field: 'nom', displayName: 'Libellé' },
          { field: 'montant', displayName: 'Montant total' },
        ],
        type: 'json',
        header: `<center><h3>Liste des achats de marchandises du ${this.$moment(
          this.jour
        ).format('ll')}</h3> fait le ${this.$moment().format(
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
