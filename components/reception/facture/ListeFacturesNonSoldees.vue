<template>
  <v-data-table
    no-data-text="Aucune Facture"
    :loading="loading"
    loading-text="En chargement ..."
    :headers="headers"
    :items="facturesNonSoldees"
    :search="search"
    :items-per-page="10"
  >
    <template #[`top`]>
      <v-toolbar flat>
        <v-btn
          class="ml-2"
          :disabled="facturesNonSoldees.length === 0"
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
    <template #[`item.client`]="{ item }">
      {{ item.client.toUpperCase() }}
    </template>
    <template #[`item.montant`]="{ item }">
      {{ item.montant | formater }}
    </template>
    <template #[`item.reste`]="{ item }">
      {{ item.reste | formater }}
    </template>
    <template #[`item.actions`]="{ item }">
      <show-facture-reception :item="item" />
    </template>
  </v-data-table>
</template>

<script>
import printjs from 'print-js'
import { mapGetters, mapActions } from 'vuex'
import ShowFactureReception from './ShowFactureReception.vue'
export default {
  components: {
    ShowFactureReception,
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
        { text: 'Chambre', value: 'chambre', sortable: false, align: 'center' },
        { text: 'Client', value: 'client', sortable: false, align: 'center' },
        { text: 'Emise le', value: 'created_at', align: 'center' },
        { text: 'Montant versé', value: 'montant', align: 'center' },
        { text: 'Montant restant', value: 'reste', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  computed: {
    ...mapGetters('facture-reception', ['facturesNonSoldees']),
  },
  mounted() {
    this.loading = true
    this.getNonSoldes().then(() => {
      this.loading = false
    })
  },
  methods: {
    ...mapActions('facture-reception', ['getNonSoldes']),
    print() {
      const factures = this.facturesNonSoldees.map((facture) => {
        return {
          chambre: facture.chambre,
          client: facture.client.toUpperCase(),
          created_at: facture.created_at,
          montant: this.$options.filters.formater(facture.montant),
          reste: this.$options.filters.formater(facture.reste),
        }
      })
      printjs({
        printable: factures,
        properties: [
          { field: 'chambre', displayName: 'Chambres' },
          { field: 'client', displayName: 'Clients' },
          { field: 'created_at', displayName: "Date d'émission" },
          { field: 'montant', displayName: 'Montant versé' },
          { field: 'reste', displayName: 'Montant restant' },
        ],
        type: 'json',
        header: `<center><h3>Factures Non Soldées</h3>${this.$moment().format(
          'll'
        )}</center><br>`,
        css: [
          'https://cdnjs.cloudflare.com/ajax/libs/vuetify/3.0.0-alpha.11/vuetify.min.css',
        ],
        style: 'td { text-align: center;font-size: small }',
      })
    },
  },
}
</script>

<style></style>
