<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Depenses
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-externe :restaurant="restaurant" />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-data-table
                no-data-text="Aucune dépense"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="depenses"
                :search="search"
                :items-per-page="10"
              >
                <template #[`top`]>
                  <v-toolbar flat>
                    <create-depense
                      v-can="permissions.create"
                      :articles="articles"
                      :restaurant="restaurant"
                    />
                    <v-btn
                      class="ml-2"
                      :disabled="depenses.length === 0"
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
                <template #[`item.montant`]="{ item }">
                  {{ item.montant | formater }}
                </template>
                <template #[`item.jour`]="{ item }">
                  {{ $moment(item.jour).format('ll') }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <v-btn
                    elevation="1"
                    color="pink"
                    icon
                    fab
                    dark
                    x-small
                    :to="`/externe/${restaurant}/depense/${item.jour}/`"
                  >
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions></v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import printjs from 'print-js'
import { mapGetters } from 'vuex'
import { DepenseExterne } from '~/helper/permissions'
import SideExterne from '~/components/externe/SideExterne.vue'
import CreateDepense from '~/components/externe/depense/CreateDepenseExterne.vue'

export default {
  components: {
    SideExterne,
    CreateDepense,
  },
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  data() {
    return {
      search: '',
      permissions: {
        create: DepenseExterne.creation,
      },
      headers: [
        { text: 'Date', value: 'jour' },
        { text: 'Montant', value: 'montant' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    const { params, store } = this.$nuxt.context
    this.restaurant = Number(params.restaurant)
    await store.dispatch('externe/depense/getCompactees', params.restaurant)
    await store.dispatch('externe/article/getAll', params.restaurant)
  },
  computed: {
    ...mapGetters({
      articles: 'externe/article/articles',
      depenses: 'externe/depense/depensesDatesCompactees',
    }),
  },
  methods: {
    print() {
      printjs({
        printable: this.depenses,
        properties: [
          { field: 'jour', displayName: 'Date' },
          { field: 'montant', displayName: 'Montant total' },
        ],
        type: 'json',
        header: `<center><h3>Liste des achats de marchandises</h3>${this.$moment().format(
          'll'
        )}</center><br>`,
        css: [
          'https://cdnjs.cloudflare.com/ajax/libs/vuetify/3.0.0-alpha.11/vuetify.min.css',
        ],
        style: 'td {text-align: center }',
      })
    },
  },
}
</script>

<style></style>
