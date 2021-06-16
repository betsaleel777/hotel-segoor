<template>
  <v-dialog v-model="dialog" max-width="750px">
    <template #activator="{ on }">
      <v-btn elevation="1" icon fab dark x-small color="pink" v-on="on">
        <v-icon small> mdi-eye </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="justify-center primary--text headline"
        ><div>Encaissement {{ item.code }} du {{ item.created_at }}</div>
      </v-card-title>
      <v-card-text justify="center" align="center">
        <div class="text-center"><h4>Liste des Articles</h4></div>
        <v-simple-table>
          <template #default>
            <thead>
              <tr>
                <th class="text-left">Réference</th>
                <th class="text-left">Description</th>
                <th class="text-left">Quantité</th>
                <th class="text-left">Prix de vente</th>
                <th class="text-left">Subtotal</th>
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
                <td>{{ article.pivot.quantite }}</td>
                <td>{{ article.pivot.prix_vente + ' FCFA' }}</td>
                <td class="text-right">
                  {{
                    String(
                      Number(article.pivot.quantite) *
                        Number(article.pivot.prix_vente)
                    ) + ' FCFA'
                  }}
                </td>
              </tr>
              <tr v-for="(plat, index) in plats" :key="index + decalage" dense>
                <td>{{ plat.code }}</td>
                <td style="width: 40%">
                  {{ plat.nom.charAt(0).toUpperCase() + plat.nom.slice(1) }}
                </td>
                <td>{{ plat.pivot.quantite }}</td>
                <td>{{ plat.pivot.prix_vente + ' FCFA' }}</td>
                <td class="text-right">
                  {{
                    String(
                      Number(plat.pivot.quantite) *
                        Number(plat.pivot.prix_vente)
                    ) + ' FCFA'
                  }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" class="text-left"><b>Total</b></td>
                <td class="text-right">
                  <b>{{ calculTotal }}</b>
                </td>
              </tr>
            </tfoot>
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
    plats: [],
    decalage: 0,
  }),
  computed: {
    calculTotal() {
      let total = 0
      this.articles.forEach((article) => {
        total +=
          Number(article.pivot.quantite) * Number(article.pivot.prix_vente)
      })
      this.plats.forEach((plat) => {
        total += Number(plat.pivot.quantite) * Number(plat.pivot.prix_vente)
      })
      return total + ' FCFA'
    },
  },
  mounted() {
    this.articles = this.item.produits
    this.decalage = this.item.produits.length
    this.plats = this.item.plats
  },
  methods: {
    closeShow() {
      this.dialog = false
    },
  },
}
</script>

<style></style>
