<template>
  <v-card elevation="2" shaped tile>
    <v-card-title class="headline grey lighten-1 primary--text">
      Categories
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <side-externe :restaurant="restaurant" />
        </v-col>
        <v-col cols="12" sm="6" md="9">
          <v-tabs
            v-model="tab"
            show-arrows
            color="indigo darken-4"
            align-with-title
            center-active
          >
            <v-tab v-for="(item, i) in items" :key="i">
              <template #default>
                <v-icon left>{{ item.icon }}</v-icon
                ><span class="text-subtitle-2">{{ item.text }}</span>
              </template>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item v-for="(item, i) in items" :key="i">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <liste-categorie
                    v-if="item.text === 'Catégories Articles'"
                    :restaurant="restaurant"
                    element="article"
                  />
                  <liste-categorie
                    v-if="item.text === 'Catégories Plats'"
                    :restaurant="restaurant"
                    element="plat"
                  />
                  <liste-categorie
                    v-if="item.text === 'Catégories Tournees'"
                    :restaurant="restaurant"
                    element="tournee"
                  />
                  <liste-categorie
                    v-if="item.text === 'Catégories Cocktails'"
                    :restaurant="restaurant"
                    element="cocktail"
                  />
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions></v-card-actions>
  </v-card>
</template>

<script>
import ListeCategorie from '~/components/externe/parametre/categorie/ListeCategorieExterne.vue'
import SideExterne from '~/components/externe/SideExterne.vue'
export default {
  components: {
    SideExterne,
    ListeCategorie,
  },
  data: () => ({
    tab: null,
    items: [
      { text: 'Catégories Articles', icon: 'mdi-cart' },
      { text: 'Catégories Plats', icon: 'mdi-food' },
      { text: 'Catégories Tournees', icon: 'mdi-glass-mug-variant' },
      { text: 'Catégories Cocktails', icon: 'mdi-glass-cocktail' },
    ],
  }),
  fetch() {
    const { params } = this.$nuxt.context
    this.restaurant = Number(params.restaurant)
  },
}
</script>

<style></style>
