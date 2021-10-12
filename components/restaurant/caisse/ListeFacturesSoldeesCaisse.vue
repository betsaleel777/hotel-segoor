<template>
  <v-data-table
    no-data-text="Aucune Donnée"
    :loading="loading"
    loading-text="En chargement ..."
    :headers="headers"
    :items="compactes"
    :search="search"
    :items-per-page="10"
  >
    <template #[`top`]>
      <v-toolbar flat>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="recherche ..."
          single-line
          hide-details
        ></v-text-field>
      </v-toolbar>
    </template>
    <template #[`item.date_soldee`]="{ item }">
      {{ $moment(item.date_soldee).format('ll') }}
    </template>
    <template #[`item.espece`]="{ item }">
      {{ item.espece | formater }}
    </template>
    <template #[`item.cheque`]="{ item }">
      {{ item.cheque | formater }}
    </template>
    <template #[`item.mobile`]="{ item }">
      {{ item.mobile | formater }}
    </template>
    <template #[`item.total`]="{ item }">
      {{ (item.espece + item.cheque + item.mobile) | formater }}
    </template>
    <template #[`item.actions`]="{ item }">
      <show-factures-soldees
        :jour="item.date_soldee"
        :date-factures="facturesDate(item.date_soldee)"
      />
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ShowFacturesSoldees from './ShowFacturesSoldees.vue'
export default {
  components: { ShowFacturesSoldees },
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  data() {
    return {
      search: '',
      loading: false,
      headers: [
        { text: 'Date', value: 'date_soldee', align: 'left', sortable: false },
        { text: 'Espèces', value: 'espece', align: 'center', sortable: false },
        { text: 'Cheque', value: 'cheque', align: 'center', sortable: false },
        { text: 'Mobile', value: 'mobile', align: 'center' },
        { text: 'Total', value: 'total', align: 'center' },
        { text: 'Actions', value: 'actions', align: 'right', sortable: false },
      ],
    }
  },
  computed: {
    ...mapGetters({
      encaissements: 'caisse/encaissement/encaissementsSoldes',
      compactes: 'caisse/encaissement/encaissementsCompactes',
    }),
  },
  async mounted() {
    this.loading = true
    await this.getSoldes().then(() => {
      this.getCompactes().then(() => {
        this.loading = false
      })
    })
  },
  methods: {
    ...mapActions({
      getCompactes: 'caisse/encaissement/getRestauCompact',
      getSoldes: 'caisse/encaissement/getEncaissementsRestauSoldes',
    }),
    facturesDate(jour) {
      return this.encaissements.filter(
        (encaissement) => encaissement.date_soldee === jour
      )
    },
  },
}
</script>

<style></style>
