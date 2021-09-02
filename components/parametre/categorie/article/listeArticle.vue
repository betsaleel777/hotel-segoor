<template>
  <v-data-table
    no-data-text="Aucune Categories"
    :loading="loading"
    loading-text="En chargement ..."
    :headers="headers"
    :items="categories"
    :search="search"
    :items-per-page="10"
    locale="fr-FR"
  >
    <template #[`top`]>
      <v-toolbar flat>
        <create-categorie-article-parametre />
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
      <edit-categorie-article :item="item" />
      <delete-categorie-article :item="item" />
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CreateCategorieArticleParametre from './CreateCategorieArticleParametre.vue'
import DeleteCategorieArticle from './DeleteCategorieArticle.vue'
import EditCategorieArticle from './EditCategorieArticle.vue'
export default {
  components: {
    EditCategorieArticle,
    DeleteCategorieArticle,
    CreateCategorieArticleParametre,
  },
  data: () => ({
    search: '',
    loading: null,
    headers: [
      { text: 'Nom', value: 'nom' },
      {
        text: 'Actions',
        value: 'actions',
        sortable: false,
        width: '30%',
        align: 'center',
      },
    ],
  }),
  computed: {
    ...mapGetters('parametre/categorie-article', ['categories']),
  },
  mounted() {
    this.loading = true
    this.getAll().then(() => {
      this.loading = false
    })
  },
  methods: {
    ...mapActions('parametre/categorie-article', ['getAll']),
  },
}
</script>

<style></style>
