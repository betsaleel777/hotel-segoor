<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Cocktails
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-stock />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-data-table
                no-data-text="Aucun Cocktail"
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
                      v-can="'creation cocktail'"
                      :floating="false"
                    />
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
                  {{ item.montant + ' FCFA' }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <edit-cocktail v-can="'modification cocktail'" :item="item" />
                  <delete-cocktail
                    v-can="'suppression cocktail'"
                    :item="item"
                  />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <create-cocktail v-can="'creation cocktail'" />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CreateCocktail from '~/components/stock/cocktail/CreateCocktail.vue'
import DeleteCocktail from '~/components/stock/cocktail/DeleteCocktail.vue'
import EditCocktail from '~/components/stock/cocktail/EditCocktail.vue'
/* eslint-disable camelcase */
import SideStock from '~/components/stock/SideStock.vue'

export default {
  components: {
    CreateCocktail,
    DeleteCocktail,
    EditCocktail,
    SideStock,
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Designation', value: 'nom', sortable: false },
        { text: 'Prix de vente', value: 'montant' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  fetch() {
    this.getAll()
  },
  computed: {
    ...mapGetters('cocktail', ['cocktails']),
  },
  methods: {
    ...mapActions('cocktail', ['getAll']),
  },
}
</script>

<style></style>
