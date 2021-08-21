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
              <v-tabs v-model="tab" fixed-tabs color="indigo darken-4">
                <v-tab v-for="item in items" :key="item">
                  {{ item }}
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item v-for="item in items" :key="item">
                  <v-row>
                    <v-col cols="2"></v-col>
                    <v-col cols="8">
                      <liste-chambre v-if="item === 'Categories de chambre'" />
                      <liste-article v-if="item === 'Categories Articles'" />
                      <liste-plat v-if="item === 'Categories de Plats'" />
                    </v-col>
                    <v-col cols="2"></v-col>
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
import ListeArticle from '~/components/parametre/categorie/article/listeArticle.vue'
import ListeChambre from '~/components/parametre/categorie/chambre/listeChambre.vue'
import ListePlat from '~/components/parametre/categorie/plat/listePlat.vue'
import SideParametre from '~/components/parametre/SideParametre.vue'

export default {
  components: {
    SideParametre,
    ListeChambre,
    ListeArticle,
    ListePlat,
  },
  data: () => ({
    tab: null,
    items: [
      'Categories de chambre',
      'Categories Articles',
      'Categories de Plats',
    ],
  }),
}
</script>

<style></style>
