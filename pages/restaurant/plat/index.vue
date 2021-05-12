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
              <side-restaurant />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="recherche ..."
                single-line
                hide-details
              ></v-text-field>
              <v-data-table
                no-data-text="Aucun plat"
                :headers="headers"
                :items="plats"
                :search="search"
                :items-per-page="12"
              >
                <template #[`item.achat`]="{ item }">
                  {{ item.achat + ' FCFA' }}
                </template>
                <template #[`item.vente`]="{ item }">
                  {{ item.vente + ' FCFA' }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <edit-plat
                    :categories="categories"
                    :item="item"
                    @edited-plat="platEdited"
                  />
                  <delete-plat :item="item" @deleted-plat="platDeleted" />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <create-plat :categories="categories" @new-plat="pushPlat" />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import CreatePlat from '~/components/restaurant/plat/CreatePlat.vue'
import DeletePlat from '~/components/restaurant/plat/DeletePlat.vue'
import EditPlat from '~/components/restaurant/plat/EditPlat.vue'
import SideRestaurant from '~/components/restaurant/SideRestaurant'
export default {
  components: {
    SideRestaurant,
    CreatePlat,
    DeletePlat,
    EditPlat,
  },
  data() {
    return {
      search: '',
      plats: [],
      categories: [],
      headers: [
        { text: 'Code', value: 'code', sortable: false },
        { text: 'Nom', value: 'nom' },
        { text: 'Categorie', value: 'categorieNom', sortable: false },
        { text: 'Prix achat', value: 'achat' },
        { text: 'Prix vente', value: 'vente' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async mounted() {
    let calebasse = await this.$axios.get('/restaurant/plats')
    const plats = calebasse.data.plats.map((plat) => {
      const imageData = plat.image ? plat.image : []
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
