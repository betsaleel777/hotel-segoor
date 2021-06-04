<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Tournées
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-gestion-bar />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-data-table
                no-data-text="Aucune Tournee"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="tournees"
                :search="search"
                :items-per-page="10"
              >
                <template #[`top`]>
                  <v-toolbar flat>
                    <create-tournee
                      :produits="produits"
                      :categories="categories"
                      :floating="false"
                      @new-tournee="pushTournee"
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
                  <edit-tournee
                    :produits="produits"
                    :item="item"
                    @edited-tournee="tourneeEdited"
                  />
                  <delete-tournee
                    :item="item"
                    @deleted-tournee="tourneeDeleted"
                  />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <create-tournee
            :categories="categories"
            :produits="produits"
            @new-tournee="pushTournee"
          />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
/* eslint-disable camelcase */
import SideGestionBar from '~/components/bar/SideGestionBar.vue'
import CreateTournee from '~/components/bar/tournee/CreateTournee.vue'
import DeleteTournee from '~/components/bar/tournee/DeleteTournee.vue'
import EditTournee from '~/components/bar/tournee/EditTournee.vue'

export default {
  components: {
    SideGestionBar,
    CreateTournee,
    DeleteTournee,
    EditTournee,
  },
  data() {
    return {
      search: '',
      tournees: [],
      produits: [],
      categories: [],
      headers: [
        { text: 'Code', value: 'code', sortable: false },
        { text: 'Titre', value: 'titre', sortable: false },
        { text: 'Prix de vente', value: 'montant' },
        { text: 'Quantité', value: 'nombre' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    let calebasse = await this.$axios.get('bar/tournees')
    this.tournees = calebasse.data.tournees.map((tournee) => {
      const { prix_list, produit_linked, id, titre, code, nombre } = tournee
      return {
        id,
        code,
        titre,
        nombre,
        produit: produit_linked.id,
        montant: prix_list[0].montant,
      }
    })
    calebasse = await this.$axios.get('stock/produits')
    this.produits = calebasse.data.produits
    calebasse = await this.$axios.get('stock/categories')
    const categories = calebasse.data.categories.map((categorie) => {
      return { id: categorie.id, nom: categorie.nom }
    })
    this.categories = categories
  },
  methods: {
    pushTournee(tournee) {
      this.tournees.push(tournee)
    },
    tourneeEdited(tournee) {
      const index = this.tournees.findIndex(
        (element) => element.id === tournee.id
      )
      this.tournees.splice(index, 1, tournee)
    },
    tourneeDeleted(tournee) {
      this.tournees = this.tournees.filter(
        (element) => element.id !== tournee.id
      )
    },
  },
}
</script>

<style></style>
