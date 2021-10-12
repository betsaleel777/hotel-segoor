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
        Factures Soldées le {{ $moment(jour).format('ll') }}
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
          :items="dateFactures"
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
          <template #[`item.zone`]="{ item }">
            <v-chip v-if="item.zone" small label color="secondary" dark>{{
              item.zone
            }}</v-chip>
            <v-chip v-else small label color="error" dark> vide </v-chip>
          </template>
          <template #[`item.actions`]="{ item }">
            <v-tooltip top>
              <template #activator="{ on: tooltip }">
                <v-btn
                  elevation="1"
                  icon
                  fab
                  dark
                  x-small
                  color="pink"
                  @click="recuPrint(item)"
                  v-on="{ ...tooltip }"
                >
                  <v-icon small> mdi-file </v-icon>
                </v-btn>
              </template>
              <span>reçu</span>
            </v-tooltip>
            <show-versememnts-caisse :item="item" />
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
import ShowVersememntsCaisse from './ShowVersementsCaisse.vue'
export default {
  components: {
    ShowVersememntsCaisse,
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
        { text: 'Emise le', value: 'created_at', align: 'center' },
        { text: 'Table', value: 'zone', align: 'center' },
        { text: 'Montant', value: 'montant', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  methods: {
    print() {
      const facture = this.factures.map((facture) => {
        return {
          code: facture.code,
          created_at: this.$moment(facture.created_at).format('ll'),
          zone: facture.zone ?? 'vide',
          montant: this.$options.filters.formater(facture.montant),
        }
      })
      printjs({
        printable: facture,
        properties: [
          { field: 'code', displayName: 'Code' },
          { field: 'created_at', displayName: 'Emis le' },
          { field: 'zone', displayName: 'Table' },
          { field: 'montant', displayName: 'Montant' },
        ],
        type: 'json',
        header: `<center><h3>Liste des encaissement par ${
          this.user.name
        }</h3>${this.$moment().format('ll')}</center><br>`,
        css: [
          'https://cdnjs.cloudflare.com/ajax/libs/vuetify/3.0.0-alpha.11/vuetify.min.css',
        ],
        style: 'td {text-align: center }',
      })
    },
    recuPrint(item) {
      const { plats, produits, cocktails, tournees } = item
      const consomation = [...plats, ...produits, ...cocktails, ...tournees]
      const dataPrint = {
        code: item.code,
        created_at: this.$moment(item.created_at).format('ll'),
        zone: item.zone ?? 'vide',
        montant: this.$options.filters.formater(item.montant),
        consomation,
      }
      console.log(dataPrint)
    },
  },
}
</script>

<style></style>
