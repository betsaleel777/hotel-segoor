<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Articles
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-stock />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-data-table
                no-data-text="Aucun produit"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="articles"
                :search="search"
                :items-per-page="10"
                ><template #[`top`]>
                  <v-toolbar flat>
                    <create-produit
                      :floating="false"
                      :categories="categories"
                    />
                    <v-btn
                      class="ml-2"
                      :disabled="articles.length === 0"
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
                <template #[`item.actions`]="{ item }">
                  <edit-produit
                    v-can="'modification article'"
                    :categories="categories"
                    :item="item"
                  />
                  <delete-produit v-can="'suppression article'" :item="item" />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <create-produit :categories="categories" />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import printjs from 'print-js'
import { mapActions, mapGetters } from 'vuex'
import CreateProduit from '~/components/stock/produit/CreateProduit.vue'
import DeleteProduit from '~/components/stock/produit/DeleteProduit.vue'
import EditProduit from '~/components/stock/produit/EditProduit.vue'
import SideStock from '~/components/stock/SideStock'
export default {
  components: {
    SideStock,
    CreateProduit,
    DeleteProduit,
    EditProduit,
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Description', value: 'nom' },
        { text: 'Famille', value: 'categorie.nom' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  fetch() {
    this.getArticles()
    this.getCategories()
  },
  computed: {
    ...mapGetters('stock/article', ['articles']),
    ...mapGetters('parametre/categorie-article', ['categories']),
  },
  methods: {
    ...mapActions({
      getArticles: 'stock/article/getAll',
      getCategories: 'parametre/categorie-article/getAll',
    }),
    print() {
      printjs({
        printable: this.articles,
        properties: [
          { field: 'nom', displayName: 'Description' },
          { field: 'categorie.nom', displayName: 'Catégorie' },
        ],
        type: 'json',
        header: `<center><h3>Liste des Articles</h3>${this.$moment().format(
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
