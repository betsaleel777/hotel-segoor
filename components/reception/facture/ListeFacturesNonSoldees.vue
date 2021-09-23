<template>
  <v-data-table
    no-data-text="Aucune Facture"
    :loading="loading"
    loading-text="En chargement ..."
    :headers="headers"
    :items="factures"
    :search="search"
    :items-per-page="10"
  >
    <template #[`top`]>
      <v-toolbar flat>
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
    <template #[`item.montant`]="{ item }"> {{ item.montant }} FCFA </template>
    <template #[`item.actions`]="{ item }">
      <show-facture-reception :item="item" />
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ShowFactureReception from './ShowFactureReception.vue'
export default {
  components: {
    ShowFactureReception,
  },
  data() {
    return {
      search: '',
      loading: null,
      headers: [
        { text: 'Code', value: 'code', sortable: false, align: 'center' },
        { text: 'Chambre', value: 'chambre', sortable: false, align: 'center' },
        { text: 'Client', value: 'client', sortable: false, align: 'center' },
        { text: 'Emise le', value: 'created_at', align: 'center' },
        { text: 'Montant', value: 'montant', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  computed: {
    ...mapGetters('facture-reception', ['factures']),
  },
  mounted() {
    this.loading = true
    this.getNonSoldes().then(() => {
      this.loading = false
    })
  },
  methods: {
    ...mapActions('facture-reception', ['getNonSoldes']),
  },
}
</script>

<style></style>
