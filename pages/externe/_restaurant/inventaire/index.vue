<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Inventaire général
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-externe :restaurant="restaurant" />
            </v-col>
            <v-col cols="9">
              <v-row>
                <v-col cols="2"></v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="recherche ..."
                    single-line
                    hide-details
                  ></v-text-field>
                  <v-data-table
                    no-data-text="Inventaire vide"
                    :loading="$fetchState.pending"
                    loading-text="En chargement ..."
                    :headers="headers"
                    :items="inventaire"
                    :search="search"
                    :items-per-page="10"
                  >
                    <template #[`item.disponible`]="{ item }">
                      {{ item.disponible + ' ' }}
                    </template>
                    <template #[`item.reste`]="{ item }">
                      {{ item.reste + ' %' }}
                    </template>
                  </v-data-table>
                </v-col>
                <v-col cols="2"></v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions> </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import printjs from 'print-js'
import SideExterne from '~/components/externe/SideExterne.vue'
export default {
  components: {
    SideExterne,
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Description', value: 'nom' },
        { text: 'Disponible', value: 'disponible' },
        { text: 'En cours', value: 'reste' },
      ],
    }
  },
  async fetch() {
    const { params, store } = this.$nuxt.context
    this.restaurant = Number(params.restaurant)
    await store.dispatch('externe/article/getInventaire', params.restaurant)
  },
  computed: {
    ...mapGetters('externe/article', ['inventaire']),
  },
  methods: {
    print() {
      printjs({
        printable: this.articles,
        properties: [
          { field: 'nom', displayName: 'Description' },
          { field: 'disponible', displayName: 'Catégorie' },
          { field: 'reste', displayName: 'En cours' },
        ],
        type: 'json',
        header: `<center><h3>Inventaire de stock</h3>${this.$moment().format(
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
