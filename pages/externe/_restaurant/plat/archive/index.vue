<template>
  <v-card elevation="2" shaped tile>
    <v-card-title class="headline grey lighten-1 primary--text">
      Archives plats
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <side-externe :restaurant="restaurant" />
        </v-col>
        <v-col cols="12" sm="6" md="9">
          <v-data-table
            no-data-text="Aucun plat archivé"
            :loading="$fetchState.pending"
            loading-text="En chargement ..."
            :headers="headers"
            :items="plats"
            :search="search"
            :items-per-page="10"
            ><template #[`top`]>
              <v-toolbar flat>
                <v-btn
                  class="ml-2"
                  color="primary"
                  dark
                  :to="`/externe/${restaurant}/plat/`"
                >
                  <v-icon left>mdi-arrow-left-thick</v-icon>
                  retour
                </v-btn>
                <v-btn
                  class="ml-2"
                  :disabled="plats.length === 0"
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
            <template #[`item.prix_vente`]="{ item }">
              {{ item.prix_vente | formater }}
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
                action="externe/plat/restorer"
              >
                Voulez restaurer le plat
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
                action="externe/plat/supprimer"
              >
                Voulez vous réelement supprimer le plat
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
import { PlatExterne } from '~/helper/permissions'
import SideExterne from '~/components/externe/SideExterne'
import ActionConfirm from '~/components/externe/ActionConfirmExterne.vue'
export default {
  components: {
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
        restorer: PlatExterne.restorer,
        supprimer: PlatExterne.supprimer,
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
    await store.dispatch('externe/plat/getTrashed', params.restaurant)
  },
  computed: {
    ...mapGetters('externe/plat', ['plats']),
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
        header: `<center><h3>Liste des plats archivés</h3>${this.$moment().format(
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
