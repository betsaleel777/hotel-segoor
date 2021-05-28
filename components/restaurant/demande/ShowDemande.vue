<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ on }">
      <v-btn elevation="1" icon fab dark x-small color="pink" v-on="on">
        <v-icon small> mdi-eye </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="justify-center primary--text headline"
        ><div>Demande {{ item.code }} du {{ item.created_at }}</div>
      </v-card-title>
      <v-card-text justify="center" align="center">
        <div class="text-center"><h4>Liste des Articles</h4></div>
        <v-list-item v-for="(article, index) in articles" :key="index" dense>
          <v-list-item-content>
            <v-list-item-title
              >{{
                article.nom.charAt(0).toUpperCase() +
                article.nom.slice(1) +
                ' -------------------------------- '
              }}{{
                'x' + article.pivot.quantite + article.mesure
              }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-4" text @click="closeShow">Cancel</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    articles: [],
  }),
  mounted() {
    this.articles = this.item.produits
  },
  methods: {
    closeShow() {
      this.dialog = false
    },
  },
}
</script>

<style></style>
