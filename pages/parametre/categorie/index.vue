<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Categories
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-parametre />
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
                        v-if="item.text === 'Catégories Chambres'"
                        element="chambre"
                      />
                      <liste-categorie
                        v-if="item.text === 'Catégories Articles'"
                        element="article"
                      />
                      <liste-categorie
                        v-if="item.text === 'Catégories Plats'"
                        element="plat"
                      />
                      <liste-categorie
                        v-if="item.text === 'Catégories Réparations'"
                        element="reparation"
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
    </v-col>
  </v-row>
</template>

<script>
import ListeCategorie from '~/components/parametre/categorie/ListeCategorie.vue'
import SideParametre from '~/components/parametre/SideParametre.vue'

export default {
  components: {
    SideParametre,
    ListeCategorie,
  },
  data: () => ({
    tab: null,
    items: [
      { text: 'Catégories Chambres', icon: 'mdi-bed' },
      { text: 'Catégories Plats', icon: 'mdi-food' },
      { text: 'Catégories Articles', icon: 'mdi-cart' },
      { text: 'Catégories Réparations', icon: 'mdi-wrench' },
    ],
  }),
}
</script>

<style></style>
