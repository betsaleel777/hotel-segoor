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
        <create-categorie-chambre-parametre @new-categorie="pushCategorie" />
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
      <edit-categorie-chambre
        :item="item"
        @edited-categorie="categorieEdited"
      />
      <delete-categorie-chambre
        :item="item"
        @deleted-categorie="categorieDeleted"
      />
    </template>
  </v-data-table>
</template>

<script>
import CreateCategorieChambreParametre from './CreateCategorieChambreParametre.vue'
import DeleteCategorieChambre from './DeleteCategorieChambre.vue'
import EditCategorieChambre from './EditCategorieChambre.vue'
export default {
  components: {
    DeleteCategorieChambre,
    EditCategorieChambre,
    CreateCategorieChambreParametre,
  },
  data: () => ({
    search: '',
    loading: null,
    categories: [],
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
    this.$axios.get('parametre/categories/chambres').then((result) => {
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

<style>
/* .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  font-size: 22px !important;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  font-size: 19px !important;
} */
</style>
