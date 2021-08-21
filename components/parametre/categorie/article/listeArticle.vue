<template>
  <v-data-table
    no-data-text="Aucune Categories de Plats"
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
        <create-categorie-article-parametre @new-categorie="pushCategorie" />
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
      <edit-categorie-article
        :item="item"
        @edited-categorie="categorieEdited"
      />
      <delete-categorie-article
        :item="item"
        @deleted-categorie="categorieDeleted"
      />
    </template>
  </v-data-table>
</template>

<script>
import CreateCategorieArticleParametre from './CreateCategorieArticleParametre.vue'
import DeleteCategorieArticle from './DeleteCategorieArticle.vue'
import EditCategorieArticle from './EditCategorieArticle.vue'

export default {
  components: {
    DeleteCategorieArticle,
    EditCategorieArticle,
    CreateCategorieArticleParametre,
  },
  data: () => ({
    search: '',
    categories: [],
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
  mounted() {
    this.$axios.get('parametre/categories/articles').then((result) => {
      this.loading = true
      this.categories = result.data.categories
      this.loading = false
    })
  },
  methods: {
    pushCategorie(categorie) {
      this.categories.push(categorie)
    },
    categorieEdited(categorie) {
      const index = this.categories.findIndex(
        (element) => element.id === categorie.id
      )
      this.categories.splice(index, 1, categorie)
    },
    categorieDeleted(categorie) {
      this.categories = this.categories.filter(
        (element) => element.id !== categorie.id
      )
    },
  },
}
</script>

<style></style>
