<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Les dépenses du {{ $moment(jour).format('ll') }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-externe :restaurant="restaurant" />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <!-- <v-breadcrumbs large :items="links">
                <template #divider>
                  <v-icon>mdi-chevron-right</v-icon>
                </template>
              </v-breadcrumbs> -->
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
                    <v-btn
                      class="ml-2"
                      color="primary"
                      dark
                      :to="`/externe/${restaurant}/depense/`"
                    >
                      <v-icon left>mdi-arrow-left-thick</v-icon>
                      retour
                    </v-btn>
                    <v-btn
                      class="ml-2"
                      color="primary"
                      dark
                      :to="`/externe/${restaurant}/depense/${jour}/archive/`"
                    >
                      <v-icon left>mdi-archive</v-icon>
                      archives
                    </v-btn>
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
                <template #[`item.actions`]="{ item }">
                  <show-depense :id="item.id" />
                  <edit-depense
                    v-can="permissions.edit"
                    :item="item"
                    :articles="articles"
                    :restaurant="restaurant"
                    :jour="jour"
                  />
                  <action-confirm
                    :restaurant="restaurant"
                    :item="item"
                    tip="archiver"
                    titre="Confirmer l'archivage"
                    icon="archive-plus"
                    color="error"
                    action="externe/depense/archiver"
                    :jour="jour"
                  >
                    Voulez vous archiver la dépense
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
import { DepenseExterne } from '~/helper/permissions'
import SideExterne from '~/components/externe/SideExterne.vue'
import EditDepense from '~/components/externe/depense/EditDepenseExterne.vue'
import ActionConfirm from '~/components/externe/ActionConfirmExterne.vue'
import ShowDepense from '~/components/externe/depense/ShowDepenseExterne.vue'

export default {
  components: {
    SideExterne,
    EditDepense,
    ActionConfirm,
    ShowDepense,
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
        edit: DepenseExterne.modifier,
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
    await store.dispatch('externe/depense/getByDate', {
      restaurant_id: params.restaurant,
      jour: params.jour,
    })
    await store.dispatch('externe/article/getAll', params.restaurant)
  },
  computed: {
    ...mapGetters({
      articles: 'externe/article/articles',
      depenses: 'externe/depense/depenses',
    }),
    // links() {
    //   return [
    //     {
    //       text: 'Dépenses',
    //       disabled: false,
    //       href: `/externe/${this.restaurant}/depense`,
    //     },
    //     {
    //       text: this.$moment(this.jour).format('ll'),
    //       disabled: true,
    //     },
    //   ]
    // },
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
