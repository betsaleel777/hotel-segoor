<template>
  <v-data-table
    no-data-text="Aucune Facture"
    :loading="loading"
    loading-text="En chargement ..."
    :headers="headers"
    :items="facturesDateCompactees"
    :search="search"
    :items-per-page="10"
  >
    <template #[`top`]>
      <v-toolbar flat>
        <v-btn
          class="ml-2"
          :disabled="facturesDateCompactees.length === 0"
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
    <template #[`item.date_soldee`]="{ item }">
      {{ $moment(item.date_soldee).format('ll') }}</template
    >
    <template #[`item.espece`]="{ item }">
      {{ item.espece | formater }}</template
    >
    <template #[`item.cheque`]="{ item }">
      {{ item.cheque | formater }}</template
    >
    <template #[`item.mobile`]="{ item }">
      {{ item.mobile | formater }}</template
    >
    <template #[`item.total`]="{ item }">
      {{ (item.espece + item.cheque + item.mobile) | formater }}</template
    >
    <template #[`item.actions`]="{ item }">
      <show-factures-soldees
        :jour="item.date_soldee"
        :date-factures="facturesDate(item.date_soldee)"
      />
    </template>
  </v-data-table>
</template>

<script>
import printjs from 'print-js'
import { mapGetters, mapActions } from 'vuex'
import ShowFacturesSoldees from './ShowFacturesSoldees.vue'
export default {
  components: {
    ShowFacturesSoldees,
  },
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  data() {
    return {
      search: '',
      loading: null,
      headers: [
        { text: 'Soldée le', value: 'date_soldee', align: 'center' },
        { text: 'Par Espèce', value: 'espece', align: 'center' },
        { text: 'Par Chèque', value: 'cheque', align: 'center' },
        { text: 'Par Mobile', value: 'mobile', align: 'center' },
        { text: 'Total Encaissé', value: 'total', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  computed: {
    ...mapGetters('facture-reception', ['facturesDateCompactees']),
    ...mapGetters('facture-reception', ['facturesSoldees']),
  },
  mounted() {
    this.loading = true
    this.getSoldes().then(() => {
      this.getSoldesCompact()
      this.loading = false
    })
  },
  methods: {
    ...mapActions({
      getSoldesCompact: 'facture-reception/getSoldesCompact',
      getSoldes: 'facture-reception/getSoldes',
    }),
    facturesDate(jour) {
      return this.facturesSoldees.filter(
        (facture) => facture.date_soldee === jour
      )
    },
    print() {
      const factures = this.facturesDateCompactees.map((facture) => {
        return {
          date_soldee: this.$moment(facture.date_soldee).format('ll'),
          mobile: this.$options.filters.formater(facture.mobile),
          cheque: this.$options.filters.formater(facture.cheque),
          espece: this.$options.filters.formater(facture.espece),
          total: this.$options.filters.formater(
            facture.espece + facture.cheque + facture.mobile
          ),
        }
      })
      printjs({
        printable: factures,
        properties: [
          { field: 'date_soldee', displayName: 'Soldée le' },
          { field: 'espece', displayName: 'Espèce Encaissé' },
          { field: 'cheque', displayName: 'Chèque Encaissé' },
          { field: 'mobile', displayName: 'Mobile Encaissé' },
          { field: 'total', displayName: 'Total Encaissé' },
        ],
        type: 'json',
        header: `<center><h3>Factures Soldées</h3>${this.$moment().format(
          'll'
        )}</center><br>`,
        css: [
          'https://cdnjs.cloudflare.com/ajax/libs/vuetify/3.0.0-alpha.11/vuetify.min.css',
        ],
        style: 'td {text-align: center;font-size: small }',
      })
    },
  },
}
</script>

<style></style>
