<template>
  <v-card elevation="2" shaped tile>
    <v-card-title class="headline grey lighten-1 primary--text">
      Articles
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <side-externe :restaurant="restaurant" />
        </v-col>
        <v-col cols="12" sm="6" md="9">
          <v-data-table
            no-data-text="Aucun article archivé"
            :loading="$fetchState.pending"
            loading-text="En chargement ..."
            :headers="headers"
            :items="articles"
            :search="search"
            :items-per-page="10"
            ><template #[`top`]>
              <v-toolbar flat>
                <v-btn
                  class="ml-2"
                  color="primary"
                  dark
                  :to="`/externe/${restaurant}/article/`"
                >
                  <v-icon left>mdi-arrow-left-thick</v-icon>
                  retour
                </v-btn>
                <v-btn
                  class="ml-2"
                  :disabled="articles.length === 0"
                  color="primary"
                  dark
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
            <template #[`item.deleted_at`]="{ item }">
              {{ $moment(item.deleted_at).format('ll') }}
            </template>
            <template #[`item.actions`]="{ item }">
              <action-confirm
                v-can="permissions.restorer"
                :restaurant="restaurant"
                :item="item"
                tip="restaurer"
                titre="Confirmer la restauration"
                color="primary"
                icon="archive-arrow-up"
                action="externe/article/restorer"
              >
                Voulez restaurer l'article
                <b>{{ item.nom.toUpperCase() }}</b>
              </action-confirm>
              <action-confirm
                v-can="permissions.supprimer"
                :restaurant="restaurant"
                :item="item"
                tip="supprimer"
                color="error"
                titre="Confirmer la suppression"
                icon="delete"
                action="externe/article/supprimer"
              >
                Voulez vous réelement supprimer l'article
                <b>{{ item.nom.toUpperCase() }}</b
                >, cette action est irréversible
              </action-confirm>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions></v-card-actions>
  </v-card>
</template>

<script>
import printjs from 'print-js'
import { mapGetters } from 'vuex'
import { ArticleExterne } from '~/helper/permissions'
import SideExterne from '~/components/externe/SideExterne'
import ActionConfirm from '~/components/externe/ActionConfirmExterne.vue'
export default {
  components: {
    SideExterne,
    ActionConfirm,
  },
  data() {
    return {
      search: '',
      restaurant: null,
      permissions: {
        restorer: ArticleExterne.restorer,
        supprimer: ArticleExterne.supprimer,
      },
      headers: [
        { text: 'Description', value: 'nom' },
        { text: 'Famille', value: 'categorie.nom' },
        { text: 'Archivé le', value: 'deleted_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    const { params, store } = this.$nuxt.context
    this.restaurant = Number(params.restaurant)
    await store.dispatch('externe/article/getTrashed', params.restaurant)
  },
  computed: {
    ...mapGetters('externe/article', ['articles']),
  },
  methods: {
    print() {
      printjs({
        printable: this.articles,
        properties: [
          { field: 'nom', displayName: 'Description' },
          { field: 'categorie.nom', displayName: 'Catégorie' },
        ],
        type: 'json',
        header: `<center><h3>Article archivé</h3>${this.$moment().format(
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
