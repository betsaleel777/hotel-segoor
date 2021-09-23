<template>
  <v-data-table
    no-data-text="Aucune Facture"
    :loading="loading"
    loading-text="En chargement ..."
    :headers="headers"
    :items="facturesCompactees"
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
      <show-factures-soldees :jour="item.date_soldee" />
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import collect from 'collect.js'
import ShowFacturesSoldees from './ShowFacturesSoldees.vue'
export default {
  components: {
    ShowFacturesSoldees,
  },
  data() {
    return {
      search: '',
      facturesCompactees: [],
      loading: null,
      headers: [
        { text: 'Soldée le', value: 'date_soldee', align: 'center' },
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
    this.getSoldes().then(() => {
      this.facturesCompactees = collect(this.factures)
        .groupBy('date_soldee')
        .map((lignes, index) => {
          let montant = 0
          lignes.all().forEach((ligne) => {
            montant += ligne.montant
          })
          return { montant, date_soldee: index }
        })
        .toArray()
      this.loading = false
    })
  },
  methods: {
    ...mapActions('facture-reception', ['getSoldes']),
  },
}
</script>

<style></style>
