<template>
  <v-card elevation="2" shaped tile>
    <v-card-title class="headline grey lighten-1 primary--text">
      Archives dépenses
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <side-externe :restaurant="restaurant" />
        </v-col>
        <v-col cols="12" sm="6" md="9">
          <v-data-table
            no-data-text="Aucune dépense archivé"
            :loading="$fetchState.pending"
            loading-text="En chargement ..."
            :headers="headers"
            :items="depenses"
            :search="search"
            :items-per-page="10"
            ><template #[`top`]>
              <v-toolbar flat>
                <v-btn
                  class="ml-2"
                  color="primary"
                  dark
                  :to="`/externe/${restaurant}/depense/${jour}`"
                >
                  <v-icon left>mdi-arrow-left-thick</v-icon>
                  retour
                </v-btn>
                <v-btn
                  class="ml-2"
                  :disabled="depenses.length === 0"
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
            <template #[`item.montant`]="{ item }">
              {{ item.montant | formater }}
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
                action="externe/depense/restorer"
                :jour="jour"
              >
                Voulez restaurer la dépense
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
                action="externe/depense/supprimer"
                :jour="jour"
              >
                Voulez vous réelement supprimer définitivement la dépense
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
import { DepenseExterne } from '~/helper/permissions'
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
        restorer: DepenseExterne.restorer,
        supprimer: DepenseExterne.supprimer,
      },
      headers: [
        { text: 'Nom', value: 'nom' },
        { text: 'Montant', value: 'montant' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    const { params, store } = this.$nuxt.context
    this.restaurant = Number(params.restaurant)
    this.jour = params.jour
    await store.dispatch('externe/depense/getTrashedByDate', {
      restaurant_id: params.restaurant,
      jour: params.jour,
    })
  },
  computed: {
    ...mapGetters('externe/depense', ['depenses']),
  },
  methods: {
    print() {
      printjs({
        printable: this.depenses,
        properties: [
          { field: 'nom', displayName: 'Libellé' },
          { field: 'montant', displayName: 'Montant total' },
        ],
        type: 'json',
        header: `<center><h3>Liste des achats de marchandises du ${this.$moment(
          this.jour
        ).format('ll')}</h3> fait le ${this.$moment().format(
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
