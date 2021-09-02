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
        <create-categorie-chambre-parametre />
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
      <edit-categorie-chambre :item="item" />
      <delete-categorie-chambre :item="item" />
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
    ...mapGetters('parametre/categorie-chambre', ['categories']),
  },
  mounted() {
    this.loading = true
    this.getAll().then(() => {
      this.loading = false
    })
  },
  methods: {
    ...mapActions('parametre/categorie-chambre', ['getAll']),
  },
}
</script>

<style></style>
