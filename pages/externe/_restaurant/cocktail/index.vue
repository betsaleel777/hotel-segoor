<template>
  <v-card elevation="2" shaped tile>
    <v-card-title class="headline grey lighten-1 primary--text">
      Cocktails
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <side-externe :restaurant="restaurant" />
        </v-col>
        <v-col cols="12" sm="6" md="9">
          <v-data-table
            no-data-text="Aucune cocktail"
            :loading="$fetchState.pending"
            loading-text="En chargement ..."
            :headers="headers"
            :items="cocktails"
            :search="search"
            :items-per-page="10"
          >
            <template #[`top`]>
              <v-toolbar flat>
                <create-cocktail
                  v-can="permissions.create"
                  :tournees="tournees"
                  :categories="categories"
                  :restaurant="restaurant"
                />
                <v-btn
                  class="ml-2"
                  color="primary"
                  dark
                  :to="`/externe/${restaurant}/cocktail/archive/`"
                >
                  <v-icon left>mdi-archive</v-icon>
                  archives
                </v-btn>
                <v-btn
                  class="ml-2"
                  :disabled="cocktails.length === 0"
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
              <edit-cocktail
                v-can="permissions.edit"
                :tournees="tournees"
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
                action="externe/cocktail/archiver"
              >
                Voulez vous archiver le cocktail
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
import { CocktailExterne } from '~/helper/permissions'
import CreateCocktail from '~/components/externe/cocktail/CreateCocktailExterne.vue'
import EditCocktail from '~/components/externe/cocktail/EditCocktailExterne.vue'
import SideExterne from '~/components/externe/SideExterne.vue'
import ActionConfirm from '~/components/externe/ActionConfirmExterne.vue'

export default {
  components: {
    SideExterne,
    ActionConfirm,
    CreateCocktail,
    EditCocktail,
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
        create: CocktailExterne.creation,
        edit: CocktailExterne.modifier,
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
    await store.dispatch('externe/cocktail/getAll', params.restaurant)
    await store.dispatch('externe/tournee/getAll', params.restaurant)
    await store.dispatch('externe/parametre/categorie-cocktail/getAll', {
      restaurant_id: this.restaurant,
    })
  },
  computed: {
    ...mapGetters({
      cocktails: 'externe/cocktail/cocktails',
      categories: 'externe/parametre/categorie-cocktail/categories',
      tournees: 'externe/tournee/tournees',
    }),
  },
  methods: {
    print() {
      const cocktails = this.cocktails.map((cocktail) => {
        return {
          nom: cocktail.nom,
          prix_vente: this.$options.filters.formater(cocktail.prix_vente),
        }
      })
      printjs({
        printable: cocktails,
        properties: [
          { field: 'nom', displayName: 'Désignation' },
          { field: 'prix_vente', displayName: 'Prix de vente' },
        ],
        type: 'json',
        header: `<center><h3>Liste des cocktails</h3>${this.$moment().format(
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
