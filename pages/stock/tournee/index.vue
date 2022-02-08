<template>
  <v-card elevation="2" shaped tile>
    <v-card-title class="headline grey lighten-1 primary--text">
      Tournées
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <side-stock />
        </v-col>
        <v-col cols="12" sm="6" md="9">
          <v-data-table
            no-data-text="Aucune Tournee"
            :loading="$fetchState.pending"
            loading-text="En chargement ..."
            :headers="headers"
            :items="tournees"
            :search="search"
            :items-per-page="10"
          >
            <template #[`top`]>
              <v-toolbar flat>
                <create-tournee
                  v-can="'creation tournee'"
                  :produits="articles"
                  :categories="categories"
                  :floating="false"
                />
                <v-btn
                  class="ml-2"
                  :disabled="tournees.length === 0"
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
            <template #[`item.nombre`]="{ item }">
              {{ item.nombre + ' ballons' }}
            </template>
            <template #[`item.contenance`]="{ item }">
              {{ item.contenance + ' cl' }}
            </template>
            <template #[`item.montant`]="{ item }">
              {{ item.montant + ' FCFA' }}
            </template>
            <template #[`item.actions`]="{ item }">
              <edit-tournee
                v-can="'modification tournee'"
                :produits="articles"
                :categories="categories"
                :item="item"
              />
              <delete-tournee v-can="'suppression tournee'" :item="item" />
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <create-tournee
        v-can="'creation tournee'"
        :categories="categories"
        :produits="articles"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import printjs from 'print-js'
import { mapGetters, mapActions } from 'vuex'
import CreateTournee from '~/components/stock/tournee/CreateTournee.vue'
import DeleteTournee from '~/components/stock/tournee/DeleteTournee.vue'
import EditTournee from '~/components/stock/tournee/EditTournee.vue'
import SideStock from '~/components/stock/SideStock.vue'

export default {
  components: {
    CreateTournee,
    DeleteTournee,
    EditTournee,
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
      headers: [
        { text: 'Code', value: 'code', sortable: false },
        { text: 'Titre', value: 'titre', sortable: false },
        { text: 'Prix de vente', value: 'montant' },
        { text: 'Quantité', value: 'nombre' },
        { text: 'Contenance', value: 'contenance' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  fetch() {
    this.getTournees()
    this.getArticleTournees()
    this.getCategories()
  },
  computed: {
    ...mapGetters('stock/tournee', ['tournees']),
    ...mapGetters('parametre/categorie-article', ['categories']),
    ...mapGetters('stock/article', ['articles']),
  },
  methods: {
    ...mapActions({
      getTournees: 'stock/tournee/getAll',
      getArticleTournees: 'stock/article/getArticlesTournee',
      getCategories: 'parametre/categorie-article/getAll',
    }),
    print() {
      const tournees = this.tournees.map((tournee) => {
        return {
          titre: tournee.titre,
          nombre: tournee.nombre,
          contenance: tournee.contenance + ' cl',
          montant: this.$options.filters.formater(tournee.montant),
        }
      })
      printjs({
        printable: tournees,
        properties: [
          { field: 'titre', displayName: 'Désignation' },
          { field: 'nombre', displayName: 'Quantité tournée' },
          { field: 'contenance', displayName: 'Contenance' },
        ],
        type: 'json',
        header: `<center><h3>Liste des tournees</h3>${this.$moment().format(
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
