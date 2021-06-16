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
                      :produits="produits"
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
                <template #[`item.actions`]="{ item }">
                  <show-encaissement :item="item" />
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
            :produits="produits"
            :attributions="attributions"
            @new-encaissement="pushEncaissement"
          />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import SideRestaurant from '~/components/restaurant/SideRestaurant.vue'
import CreateEncaissement from '~/components/restaurant/caisse/CreateEncaissement.vue'
import ShowEncaissement from '~/components/restaurant/caisse/ShowEncaissement.vue'

export default {
  components: {
    SideRestaurant,
    CreateEncaissement,
    ShowEncaissement,
  },
  data() {
    return {
      search: '',
      encaissements: [],
      produits: [],
      attributions: [],
      headers: [
        { text: 'Code', value: 'code', sortable: false },
        { text: 'Statut', value: 'status', sortable: false },
        { text: 'Date', value: 'created_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    let departement = null
    let requete = await this.$axios.get(
      'parametre/departements/' + 'restaurant'
    )
    departement = requete.data.departement.id

    // recuperation de la liste des produits boissons en stock pour le départements en cours
    requete = await this.$axios.get(
      'stock/demandes/inventaire/buvable/' + departement
    )
    this.produits = requete.data.inventaire
    // recupération des plats créer
    requete = await this.$axios.get('restaurant/plats')
    this.produits.push(...requete.data.plats)
    this.produits = this.produits.map((produit) => {
      if (produit.prix) {
        return {
          ...produit,
          genre: 'plats',
          prix_vente: produit.prix[0].vente,
          valeur: 0,
        }
      } else {
        return { ...produit, genre: 'boissons', valeur: 0 }
      }
    })
    // recuperation des attributions de chambre
    requete = await this.$axios.get('reception/attributions')
    const donneesFiltrees = requete.data.attributions.filter(
      (attribution) => attribution.status === 'occupée'
    )
    this.attributions = donneesFiltrees.map((attribution) => {
      return {
        id: attribution.id,
        nom: `Chambre ${attribution.chambre_linked.nom} ${attribution.client_linked.nom} ${attribution.client_linked.contact}`,
        prix: attribution.chambre_linked.prix_list[0].montant,
        remise: attribution.remise,
      }
    })
    // récuperation de la liste des enregistrements au niveau de la caisse
    requete = await this.$axios.get('caisses/encaissements')
    this.encaissements = requete.data.encaissements.map((encaissement) => {
      const { attribution_linked: attribution, produits, plats } = encaissement
      return {
        id: encaissement.id,
        code: encaissement.code,
        created_at: this.$moment(encaissement.created_at).format('ll'),
        status: encaissement.status,
        attribution,
        produits,
        plats,
      }
    })
  },
  methods: {
    getColor(status) {
      if (status === 'soldée') {
        return 'green'
      } else if (status === 'en cours') {
        return 'blue'
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
  },
}
</script>

<style></style>
