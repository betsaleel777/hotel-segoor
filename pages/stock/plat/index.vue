<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Plat
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-stock />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-data-table
                no-data-text="Aucun plat"
                loading-text="En chargement ..."
                :loading="$fetchState.pending"
                :headers="headers"
                :items="plats"
                :search="search"
                :items-per-page="10"
                ><template #[`top`]>
                  <v-toolbar flat>
                    <create-plat
                      v-can="'creation plat'"
                      :floating="false"
                      :categories="categories"
                      @new-plat="pushPlat"
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
                <template #[`item.achat`]="{ item }">
                  {{ item.achat + ' FCFA' }}
                </template>
                <template #[`item.vente`]="{ item }">
                  {{ item.vente + ' FCFA' }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <edit-plat
                    v-can="'modification plat'"
                    :categories="categories"
                    :item="item"
                    @edited-plat="platEdited"
                  />
                  <delete-plat
                    v-can="'suppression plat'"
                    :item="item"
                    @deleted-plat="platDeleted"
                  />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <create-plat
            v-can="'creation plat'"
            :categories="categories"
            @new-plat="pushPlat"
          />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
/* eslint-disable no-unused-vars */
import CreatePlat from '~/components/stock/plat/CreatePlat.vue'
import DeletePlat from '~/components/stock/plat/DeletePlat.vue'
import EditPlat from '~/components/stock/plat/EditPlat.vue'
import SideStock from '~/components/stock/SideStock.vue'
export default {
  components: {
    CreatePlat,
    DeletePlat,
    EditPlat,
    SideStock,
  },
  data() {
    return {
      search: '',
      plats: [],
      categories: [],
      headers: [
        { text: 'Nom', value: 'nom' },
        { text: 'Categorie', value: 'categorieNom', sortable: false },
        { text: 'Coût de revient', value: 'achat' },
        { text: 'Prix de vente', value: 'vente' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    let calebasse = await this.$axios.get('/restaurant/plats')
    const plats = calebasse.data.plats.map((plat) => {
      const imageData = plat.image ? plat.image : []
      const ingredients = plat.produits.map((ingredient) => {
        return {
          id: ingredient.id,
          ingredient: ingredient.nom,
          type: ingredient.type,
          quantite: ingredient.pivot.quantite,
          commentaire: ingredient.commentaire ? ingredient.commentaire : '',
          mesure: ingredient.mesure,
        }
      })
      return {
        id: plat.id,
        code: plat.code,
        nom: plat.nom,
        categorie: plat.categorie,
        categorieNom: plat.categorie_linked.nom,
        image: imageData,
        description: plat.description,
        achat: plat.prix[0].achat,
        vente: plat.prix[0].vente,
        ingredients,
      }
    })
    calebasse = await this.$axios.get('restaurant/categories')
    const categories = calebasse.data.categories.map((categorie) => {
      return { id: categorie.id, nom: categorie.nom }
    })
    this.categories = categories
    this.plats = plats
  },
  methods: {
    pushPlat(plat) {
      this.plats.push(plat)
    },
    platEdited(plat) {
      const index = this.plats.findIndex((element) => element.id === plat.id)
      this.plats.splice(index, 1, plat)
    },
    platDeleted(plat) {
      this.plats = this.plats.filter((element) => element.id !== plat.id)
    },
  },
}
</script>

<style></style>
