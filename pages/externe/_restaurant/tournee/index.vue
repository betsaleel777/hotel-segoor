<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Tournées
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-externe :restaurant="restaurant" />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-data-table
                no-data-text="Aucune Tournee"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="tournees"
                :search="search"
                :items-per-page="10"
              >
                <template #[`top`]>
                  <v-toolbar flat>
                    <create-tournee
                      v-can="permissions.create"
                      :articles="articles"
                      :categories="categories"
                      :restaurant="restaurant"
                    />
                    <v-btn
                      class="ml-2"
                      color="primary"
                      dark
                      :to="`/externe/${restaurant}/tournee/archive/`"
                    >
                      <v-icon left>mdi-archive</v-icon>
                      archives
                    </v-btn>
                    <v-btn
                      class="ml-2"
                      :disabled="tournees.length === 0"
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
                <template #[`item.nombre`]="{ item }">
                  {{ item.nombre + ' ballons' }}
                </template>
                <template #[`item.prix_vente`]="{ item }">
                  {{ item.prix_vente | formater }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <edit-tournee
                    v-can="permissions.edit"
                    :articles="articles"
                    :categories="categories"
                    :restaurant="restaurant"
                    :item="item"
                  />
                  <action-confirm
                    :restaurant="restaurant"
                    :item="item"
                    tip="archiver"
                    titre="Confirmer l'archivage"
                    icon="archive-plus"
                    color="error"
                    action="externe/tournee/archiver"
                  >
                    Voulez vous archiver la tournee
                    <b>{{ item.nom.toUpperCase() }}</b>
                  </action-confirm>
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
import { TourneeExterne } from '~/helper/permissions'
import CreateTournee from '~/components/externe/tournee/CreateTourneeExterne.vue'
import EditTournee from '~/components/externe/tournee/EditTourneeExterne.vue'
import SideExterne from '~/components/externe/SideExterne.vue'
import ActionConfirm from '~/components/externe/ActionConfirmExterne.vue'

export default {
  components: {
    CreateTournee,
    EditTournee,
    SideExterne,
    ActionConfirm,
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
        create: TourneeExterne.creation,
        edit: TourneeExterne.modifier,
      },
      headers: [
        { text: 'Code', value: 'code', sortable: false },
        { text: 'Nom', value: 'nom', sortable: false },
        { text: 'Prix de vente', value: 'prix_vente' },
        { text: 'Quantité', value: 'nombre' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    const { params, store } = this.$nuxt.context
    this.restaurant = Number(params.restaurant)
    await store.dispatch('externe/tournee/getAll', params.restaurant)
    await store.dispatch('externe/article/getArticlesTournee')
    await store.dispatch(
      'externe/parametre/categorie-tournee/getAll',
      params.restaurant
    )
  },
  computed: {
    ...mapGetters({
      tournees: 'externe/tournee/tournees',
      categories: 'externe/parametre/categorie-tournee/categories',
      articles: 'externe/article/articles',
    }),
  },
  methods: {
    print() {
      const tournees = this.tournees.map((tournee) => {
        return {
          nom: tournee.nom,
          nombre: tournee.nombre,
          prix_vente: this.$options.filters.formater(tournee.prix_vente),
        }
      })
      printjs({
        printable: tournees,
        properties: [
          { field: 'nom', displayName: 'Désignation' },
          { field: 'nombre', displayName: 'Nbre ballons' },
          { field: 'prix_vente', displayName: 'Prix de vente' },
        ],
        type: 'json',
        header: `<center><h3>Liste des tournees</h3>${this.$moment().format(
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
