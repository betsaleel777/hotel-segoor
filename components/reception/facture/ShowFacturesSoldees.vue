<template>
  <v-dialog v-model="dialogue" max-width="800px">
    <template #activator="{ on: dialog }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            elevation="1"
            icon
            fab
            dark
            x-small
            color="pink"
            v-on="{ ...tooltip, ...dialog }"
          >
            <v-icon small> mdi-eye </v-icon>
          </v-btn>
        </template>
        <span>visualiser</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="headline grey lighten-1 primary--text">
        Factures Soldée le {{ $moment(jour).format('ll') }}
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="dialogue = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
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
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="recherche ..."
                single-line
                hide-details
              ></v-text-field>
            </v-toolbar>
          </template>
          <template #[`item.created_at`]="{ item }">
            {{ $moment(item.created_at).format('ll') }}
          </template>
          <template #[`item.montant`]="{ item }">
            {{ item.montant }} FCFA
          </template>
          <template #[`item.actions`]="{ item }">
            <show-facture-reception :item="item" />
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="print"
          ><v-icon left>mdi-printer</v-icon>imprimer</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import printjs from 'print-js'
import ShowFactureReception from '~/components/reception/facture/ShowFactureReception.vue'
const somme = function (versements) {
  let sum = 0
  versements.forEach((versement) => {
    sum += versement.montant - versement.monnaie
  })
  return sum
}
export default {
  components: {
    ShowFactureReception,
  },
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  props: {
    jour: {
      type: String,
      required: true,
    },
    dateFactures: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      search: '',
      dialogue: false,
      factures: [],
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
  mounted() {
    this.loading = true
    this.factures = this.dateFactures.map((facture) => {
      const { attribution, reservation, versements, ...rest } = facture
      let object = {}
      if (attribution) {
        object = {
          ...rest,
          chambre: attribution.chambre_linked.nom,
          client:
            attribution.client_linked.nom +
            ' ' +
            attribution.client_linked.prenom,
          versements,
          attribution,
          montant: somme(versements),
        }
      } else if (reservation) {
        object = {
          ...rest,
          chambre: reservation.chambre_linked.nom,
          client:
            reservation.client_linked.nom +
            ' ' +
            reservation.client_linked.prenom,
          versements,
          reservation,
          montant: somme(versements),
        }
      }
      return object
    })
    this.loading = false
  },
  methods: {
    print() {
      const factures = this.factures.map((facture) => {
        return {
          code: facture.code,
          chambre: facture.chambre,
          client: facture.client,
          created_at: this.$moment(facture.created_at).format('ll'),
          montant: this.$options.filters.formater(facture.montant),
        }
      })
      printjs({
        printable: factures,
        properties: [
          { field: 'code', displayName: 'Code' },
          { field: 'chambre', displayName: 'Chambres' },
          { field: 'client', displayName: 'Clients' },
          { field: 'created_at', displayName: "Date d'émission" },
          { field: 'montant', displayName: 'Montant' },
        ],
        type: 'json',
        header: `<center><h3>Liste des Factures Soldées le ${
          this.jour
        }</h3><span class="text-muted">Imprimée le ${this.$moment().format(
          'll'
        )}</span></center><br>`,
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
