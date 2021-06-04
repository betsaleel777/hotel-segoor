<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template #activator="{ on }">
      <v-btn elevation="1" icon fab dark x-small color="pink" v-on="on">
        <v-icon small> mdi-eye </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="justify-center primary--text headline"
        ><div>Sortie {{ item.code }} du {{ item.created_at }}</div>
      </v-card-title>
      <v-card-text justify="center" align="center">
        <div class="text-center"><h4>Liste des Articles</h4></div>
        <v-simple-table>
          <template #default>
            <thead>
              <tr>
                <th class="text-left">Réference</th>
                <th class="text-left">Description</th>
                <th class="text-left">Quantité demandées</th>
                <th class="text-left">Quantité livrées</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(article, index) in articles" :key="index" dense>
                <td>{{ article.code }}</td>
                <td style="width: 30%">
                  {{
                    article.nom.charAt(0).toUpperCase() + article.nom.slice(1)
                  }}
                </td>
                <td>{{ article.pivot.demandees + article.mesure }}</td>
                <td>{{ article.pivot.quantite + article.mesure }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
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
