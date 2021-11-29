<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Chambres
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-parametre />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-data-table
                no-data-text="Aucune Chambre"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="chambres"
                :search="search"
                :items-per-page="10"
              >
                <template #[`top`]>
                  <v-toolbar flat>
                    <create-chambre-form
                      :categories="categories"
                      :floating="false"
                    />
                    <v-btn
                      class="ml-2"
                      :disabled="chambres.length === 0"
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
                <template #[`item.status`]="{ item }">
                  <v-chip outlined small :color="getColor(item.status)" dark>
                    {{ item.status }}
                  </v-chip>
                </template>
                <template #[`item.prix_vente`]="{ item }">
                  {{ item.prix_vente | formater }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <show-chambre :id="item.id" />
                  <edit-chambre-form :categories="categories" :item="item" />
                  <delete-chambre-form :item="item" />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <create-chambre-form :categories="categories" />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import printjs from 'print-js'
import { mapGetters, mapActions } from 'vuex'
import CreateChambreForm from '~/components/parametre/chambre/CreateChambreForm.vue'
import EditChambreForm from '~/components/parametre/chambre/EditChambreForm.vue'
import DeleteChambreForm from '~/components/parametre/chambre/DeleteChambreForm.vue'
import SideParametre from '~/components/parametre/SideParametre.vue'
import ShowChambre from '~/components/parametre/chambre/ShowChambre.vue'

export default {
  components: {
    EditChambreForm,
    DeleteChambreForm,
    CreateChambreForm,
    SideParametre,
    ShowChambre,
  },
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Nom', value: 'nom', sortable: false },
        { text: 'Standing', value: 'standing', sortable: false },
        { text: 'Status', value: 'status', sortable: false },
        { text: 'Montant', value: 'prix_vente' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  fetch() {
    this.getChambres()
    this.getCategories()
  },
  computed: {
    ...mapGetters('parametre/chambre', ['chambres']),
    ...mapGetters('parametre/categorie-chambre', ['categories']),
  },
  methods: {
    ...mapActions({
      getChambres: 'parametre/chambre/getAll',
      getCategories: 'parametre/categorie-chambre/getAll',
    }),
    getColor(status) {
      if (status === 'libre') {
        return 'green'
      } else if (status === 'occupée') {
        return 'red'
      } else {
        return 'orange'
      }
    },
    print() {
      const chambres = this.chambres.map((chambre) => {
        return {
          nom: chambre.nom,
          standing: chambre.standing,
          prix_vente: this.$options.filters.formater(chambre.prix_vente),
        }
      })
      printjs({
        printable: chambres,
        properties: [
          { field: 'nom', displayName: 'Nom' },
          { field: 'standing', displayName: 'Standing' },
          { field: 'prix_vente', displayName: 'Montant' },
        ],
        type: 'json',
        header: `<center><h3>Liste des Chambres</h3>${this.$moment().format(
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
