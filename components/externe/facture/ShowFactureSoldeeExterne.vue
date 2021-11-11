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
            @click="getDateFacture"
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
            {{ item.montant | formater }}
          </template>
          <template #[`item.actions`]="{ item }">
            <show-detail-facture-externe :item="item" />
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
import { mapActions, mapGetters } from 'vuex'
import printjs from 'print-js'
import ShowDetailFactureExterne from './ShowDetailFactureExterne.vue'

export default {
  components: {
    ShowDetailFactureExterne,
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
    restaurant: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      search: '',
      dialogue: false,
      loading: null,
      headers: [
        { text: 'Date', value: 'created_at', align: 'center' },
        { text: 'Table', value: 'table.nom', align: 'center', sortable: false },
        { text: 'Montant', value: 'montant', align: 'center' },
        { text: 'Versé', value: 'verse', align: 'center' },
        { text: 'Actions', value: 'actions', align: 'right', sortable: false },
      ],
    }
  },
  computed: {
    ...mapGetters('externe/facture', ['factures']),
  },
  methods: {
    ...mapActions('externe/facture', ['getByDate']),
    print() {
      const factures = this.factures.map((facture) => {
        return {
          code: facture.code,
          table: facture.table.nom,
          montant: this.$options.filters.formater(facture.montant),
          verse: facture.verse,
          created_at: this.$moment(facture.created_at).format('ll'),
        }
      })
      printjs({
        printable: factures,
        properties: [
          { field: 'code', displayName: 'Code' },
          { field: 'table', displayName: 'Tables' },
          { field: 'montant', displayName: 'Montant' },
          { field: 'verse', displayName: 'Versé' },
          { field: 'created_at', displayName: "Date d'émission" },
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
    async getDateFacture() {
      this.loading = true
      await this.getByDate({ jour: this.jour, restaurant_id: this.restaurant })
      this.loading = false
    },
  },
}
</script>

<style></style>
