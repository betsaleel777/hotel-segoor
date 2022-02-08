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
            no-data-text="Aucun article"
            :loading="$fetchState.pending"
            loading-text="En chargement ..."
            :headers="headers"
            :items="articles"
            :search="search"
            :items-per-page="10"
            ><template #[`top`]>
              <v-toolbar flat>
                <create-article
                  v-can="permissions.create"
                  :categories="categories"
                  :restaurant="restaurant"
                />
                <v-btn
                  class="ml-2"
                  color="primary"
                  dark
                  :to="`/externe/${restaurant}/article/archive/`"
                >
                  <v-icon left>mdi-archive</v-icon>
                  archives
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
            <template #[`item.actions`]="{ item }">
              <edit-article
                v-can="permissions.edit"
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
                action="externe/article/archiver"
              >
                Voulez vous archiver l'article
                <b>{{ item.nom.toUpperCase() }}</b>
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
import CreateArticle from '~/components/externe/article/CreateArticleExterne'
import EditArticle from '~/components/externe/article/EditArticleExterne'
import SideExterne from '~/components/externe/SideExterne'
import ActionConfirm from '~/components/externe/ActionConfirmExterne.vue'
export default {
  components: {
    CreateArticle,
    EditArticle,
    SideExterne,
    ActionConfirm,
  },
  data() {
    return {
      search: '',
      restaurant: null,
      permissions: {
        create: ArticleExterne.creation,
        edit: ArticleExterne.modifier,
      },
      headers: [
        { text: 'Description', value: 'nom' },
        { text: 'Famille', value: 'categorie.nom' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    const { params, store } = this.$nuxt.context
    this.restaurant = Number(params.restaurant)
    await store.dispatch('externe/article/getAll', params.restaurant)
    await store.dispatch('externe/parametre/categorie-article/getAll', {
      restaurant_id: this.restaurant,
    })
  },
  computed: {
    ...mapGetters('externe/article', ['articles']),
    ...mapGetters('externe/parametre/categorie-article', ['categories']),
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
        header: `<center><h3>Liste des Articles</h3>${this.$moment().format(
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
