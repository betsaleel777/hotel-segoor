<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Plats
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-externe :restaurant="restaurant" />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-data-table
                no-data-text="Aucun plat"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="plats"
                :search="search"
                :items-per-page="10"
              >
                <template #[`top`]>
                  <v-toolbar flat>
                    <create-plat
                      v-can="permissions.create"
                      :articles="articles"
                      :categories="categories"
                      :restaurant="restaurant"
                    />
                    <v-btn
                      class="ml-2"
                      color="primary"
                      dark
                      :to="`/externe/${restaurant}/plat/archive/`"
                    >
                      <v-icon left>mdi-archive</v-icon>
                      archives
                    </v-btn>
                    <v-btn
                      class="ml-2"
                      :disabled="plats.length === 0"
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
                <template #[`item.prix_vente`]="{ item }">
                  {{ item.prix_vente | formater }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <edit-plat
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
                    action="externe/plat/archiver"
                  >
                    Voulez vous archiver le plat
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
import { PlatExterne } from '~/helper/permissions'
import SideExterne from '~/components/externe/SideExterne.vue'
import ActionConfirm from '~/components/externe/ActionConfirmExterne.vue'
import CreatePlat from '~/components/externe/plat/CreatePlatExterne.vue'
import EditPlat from '~/components/externe/plat/EditPlatExterne.vue'

export default {
  components: {
    SideExterne,
    ActionConfirm,
    CreatePlat,
    EditPlat,
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
        create: PlatExterne.creation,
        edit: PlatExterne.modifier,
      },
      headers: [
        { text: 'Code', value: 'code', sortable: false },
        { text: 'Nom', value: 'nom', sortable: false },
        { text: 'Prix de vente', value: 'prix_vente' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    const { params, store } = this.$nuxt.context
    this.restaurant = Number(params.restaurant)
    await store.dispatch('externe/plat/getAll', params.restaurant)
    await store.dispatch('externe/article/getArticlesPlat', params.restaurant)
    await store.dispatch('externe/parametre/categorie-plat/getAll', {
      restaurant_id: this.restaurant,
    })
  },
  computed: {
    ...mapGetters({
      plats: 'externe/plat/plats',
      categories: 'externe/parametre/categorie-plat/categories',
      articles: 'externe/article/articles',
    }),
  },
  methods: {
    print() {
      const plats = this.plats.map((plat) => {
        return {
          nom: plat.nom,
          prix_vente: this.$options.filters.formater(plat.prix_vente),
        }
      })
      printjs({
        printable: plats,
        properties: [
          { field: 'nom', displayName: 'Désignation' },
          { field: 'prix_vente', displayName: 'Prix de vente' },
        ],
        type: 'json',
        header: `<center><h3>Liste des plats</h3>${this.$moment().format(
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
