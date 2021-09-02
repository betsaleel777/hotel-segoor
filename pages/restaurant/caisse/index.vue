<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Caisse
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-restaurant />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-data-table
                no-data-text="Aucune Donnée"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="encaissements"
                :search="search"
                :items-per-page="10"
              >
                <template #[`top`]>
                  <v-toolbar flat>
                    <create-encaissement
                      v-can="'creation facture restau'"
                      :produits="allProducts"
                      :attributions="attributions"
                      :floating="false"
                      @new-encaissement="pushEncaissement"
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
                <template #[`item.status`]="{ item }">
                  <v-chip outlined small :color="getColor(item.status)" dark>
                    {{ item.status }}
                  </v-chip>
                </template>
                <template #[`item.montant`]="{ item }">
                  {{ item.montant }} FCFA
                </template>
                <template #[`item.actions`]="{ item }">
                  <show-encaissement :item="item" />
                  <completer-encaissement
                    v-if="item.status === 'impayé'"
                    v-can="'modification facture restau'"
                    :item="item"
                    :produits="allProducts"
                    @completed-encaissement="encaissementCompleted"
                  />
                  <v-btn
                    :to="'/restaurant/caisse/' + item.id"
                    elevation="1"
                    icon
                    fab
                    dark
                    x-small
                    color="primary"
                  >
                    <v-icon small> mdi-upload </v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <create-encaissement
            v-can="'creation facture restau'"
            :produits="allProducts"
            :attributions="attributions"
            @new-encaissement="pushEncaissement"
          />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SideRestaurant from '~/components/restaurant/SideRestaurant.vue'
import CreateEncaissement from '~/components/restaurant/caisse/CreateEncaissement.vue'
import ShowEncaissement from '~/components/restaurant/caisse/ShowEncaissement.vue'
import CompleterEncaissement from '~/components/restaurant/caisse/CompleterEncaissement.vue'

export default {
  components: {
    SideRestaurant,
    CreateEncaissement,
    ShowEncaissement,
    CompleterEncaissement,
  },
  data() {
    return {
      search: '',
      allProducts: [],
      headers: [
        { text: 'Code', value: 'code', align: 'left', sortable: false },
        { text: 'Statut', value: 'status', align: 'center', sortable: false },
        { text: 'Date', value: 'created_at', align: 'center' },
        { text: 'Table', value: 'zone', align: 'center', sortable: false },
        { text: 'Montant', value: 'montant', align: 'center' },
        { text: 'Actions', value: 'actions', align: 'right', sortable: false },
      ],
    }
  },
  async fetch() {
    let departement = null
    const requete = await this.$axios.get(
      'parametre/departements/' + 'restaurant'
    )
    departement = requete.data.departement.id
    // recuperation de la liste des produits boissons en stock pour le départements en cours
    this.getProduits(departement)
    // recupération des plats créer
    this.getPlats()
    this.getTournees()
    this.getCocktails()
    this.allProducts.push(...this.produits)
    this.allProducts.push(...this.plats)
    this.allProducts.push(...this.tournees)
    this.allProducts.push(...this.cocktails)
    // recuperation des attributions de chambre
    this.getAttributions()
    // récuperation de la liste des enregistrements au niveau de la caisse
    this.getEncaissements(departement)
    // console.log(this.allProducts)
  },
  computed: {
    ...mapGetters({
      produits: 'stock/article/articles',
      encaissements: 'caisse/encaissement/encaissements',
      attributions: 'reception/attribution/attributions',
      plats: 'stock/plat/plats',
      tournees: 'stock/tournee/tournees',
      cocktails: 'stock/cocktail/cocktails',
    }),
  },
  methods: {
    ...mapActions({
      getProduits: 'stock/article/getArticlesDepartement',
      getEncaissements: 'caisse/encaissement/getEncaissementsDepartement',
      getAttributions: 'reception/attribution/getEnCours',
      getPlats: 'stock/plat/getPlats',
      getTournees: 'stock/tournee/getTournees',
      getCocktails: 'stock/cocktail/getCocktails',
    }),
    getColor(status) {
      if (status === 'soldée') {
        return 'green'
      } else {
        return 'red'
      }
    },
    pushEncaissement(encaissement) {
      encaissement.created_at = this.$moment(encaissement.created_at).format(
        'll'
      )
      this.encaissements.push(encaissement)
    },
    encaissementCompleted(encaissement) {
      encaissement.created_at = this.$moment(encaissement.created_at).format(
        'll'
      )
      const index = this.encaissements.findIndex(
        (element) => element.id === encaissement.id
      )
      this.encaissements.splice(index, 1, encaissement)
    },
  },
}
</script>

<style></style>
