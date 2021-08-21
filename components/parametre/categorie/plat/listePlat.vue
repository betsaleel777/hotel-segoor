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
        <create-categorie-plat-parametre @new-categorie="pushCategorie" />
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
      <edit-categorie-plat :item="item" @edited-categorie="categorieEdited" />
      <delete-categorie-plat
        :item="item"
        @deleted-categorie="categorieDeleted"
      />
    </template>
  </v-data-table>
</template>

<script>
import CreateCategoriePlatParametre from './CreateCategoriePlatParametre.vue'
import DeleteCategoriePlat from './DeleteCategoriePlat.vue'
import EditCategoriePlat from './EditCategoriePlat.vue'
export default {
  components: {
    DeleteCategoriePlat,
    EditCategoriePlat,
    CreateCategoriePlatParametre,
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
    this.$axios.get('parametre/categories/plats').then((result) => {
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
