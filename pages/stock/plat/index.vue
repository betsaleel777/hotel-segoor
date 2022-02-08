<template>
  <v-card elevation="2" shaped tile>
    <v-card-title class="headline grey lighten-1 primary--text">
      Plat
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <side-stock />
        </v-col>
        <v-col cols="12" sm="6" md="9">
          <v-data-table
            no-data-text="Aucun plat"
            loading-text="En chargement ..."
            :loading="$fetchState.pending"
            :headers="headers"
            :items="plats"
            :search="search"
            :items-per-page="10"
            ><template #[`top`]>
              <v-toolbar flat>
                <create-plat
                  v-can="'creation plat'"
                  :floating="false"
                  :categories="categories"
                />
                <v-btn
                  class="ml-2"
                  :disabled="plats.length === 0"
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
            <template #[`item.achat`]="{ item }">
              {{ item.achat + ' FCFA' }}
            </template>
            <template #[`item.vente`]="{ item }">
              {{ item.vente + ' FCFA' }}
            </template>
            <template #[`item.actions`]="{ item }">
              <edit-plat
                v-can="'modification plat'"
                :categories="categories"
                :item="item"
              />
              <delete-plat v-can="'suppression plat'" :item="item" />
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <create-plat v-can="'creation plat'" :categories="categories" />
    </v-card-actions>
  </v-card>
</template>

<script>
import printjs from 'print-js'
import { mapActions, mapGetters } from 'vuex'
import CreatePlat from '~/components/stock/plat/CreatePlat.vue'
import DeletePlat from '~/components/stock/plat/DeletePlat.vue'
import EditPlat from '~/components/stock/plat/EditPlat.vue'
import SideStock from '~/components/stock/SideStock.vue'
export default {
  components: {
    CreatePlat,
    DeletePlat,
    EditPlat,
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
        { text: 'Nom', value: 'nom' },
        { text: 'Categorie', value: 'categorieNom', sortable: false },
        { text: 'Coût de revient', value: 'achat' },
        { text: 'Prix de vente', value: 'vente' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  fetch() {
    this.getPlats()
    this.getCategories()
  },
  computed: {
    ...mapGetters('stock/plat', ['plats']),
    ...mapGetters('parametre/categorie-plat', ['categories']),
  },
  methods: {
    ...mapActions({
      getPlats: 'stock/plat/getAll',
      getCategories: 'parametre/categorie-plat/getAll',
    }),
    print() {
      const plats = this.plats.map((plat) => {
        return {
          nom: plat.nom,
          categorie: plat.categorieNom,
          vente: this.$options.filters.formater(plat.vente),
        }
      })
      printjs({
        printable: plats,
        properties: [
          { field: 'nom', displayName: 'Nom' },
          { field: 'categorie', displayName: 'Catégorie' },
          { field: 'vente', displayName: 'Prix de vente' },
        ],
        type: 'json',
        header: `<center><h3>Liste des Plats</h3>${this.$moment().format(
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
