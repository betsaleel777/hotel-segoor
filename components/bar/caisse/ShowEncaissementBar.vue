<template>
  <v-dialog v-model="dialog" max-width="750px">
    <template #activator="{ on }">
      <v-btn elevation="1" icon fab dark x-small color="pink" v-on="on">
        <v-icon small> mdi-eye </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="justify-center primary--text headline grey lighten-2"
        ><div>Encaissement {{ item.code }} du {{ item.created_at }}</div>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="closeShow">
          <v-icon>mdi-close</v-icon>
        </v-btn>
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
              <tr
                v-for="(plat, index) in plats"
                :key="index + decalages[0]"
                dense
              >
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
              <tr
                v-for="(cocktail, index) in cocktails"
                :key="index + decalages[1]"
                dense
              >
                <td>{{ cocktail.code }}</td>
                <td style="width: 40%">
                  {{
                    cocktail.nom.charAt(0).toUpperCase() + cocktail.nom.slice(1)
                  }}
                </td>
                <td>{{ cocktail.pivot.quantite }}</td>
                <td>{{ cocktail.pivot.prix_vente + ' FCFA' }}</td>
                <td class="text-right">
                  {{
                    String(
                      Number(cocktail.pivot.quantite) *
                        Number(cocktail.pivot.prix_vente)
                    ) + ' FCFA'
                  }}
                </td>
              </tr>
              <tr
                v-for="(tournee, index) in tournees"
                :key="index + decalages[2]"
                dense
              >
                <td>{{ tournee.code }}</td>
                <td style="width: 40%">
                  {{
                    tournee.titre.charAt(0).toUpperCase() +
                    tournee.titre.slice(1)
                  }}
                </td>
                <td>{{ tournee.pivot.quantite }}</td>
                <td>{{ tournee.pivot.prix_vente + ' FCFA' }}</td>
                <td class="text-right">
                  {{
                    String(
                      Number(tournee.pivot.quantite) *
                        Number(tournee.pivot.prix_vente)
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
        <v-btn color="error" text @click="closeShow">Fermer</v-btn>
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
    cocktails: [],
    tournees: [],
    decalages: [],
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
      this.cocktails.forEach((cocktail) => {
        total +=
          Number(cocktail.pivot.quantite) * Number(cocktail.pivot.prix_vente)
      })
      this.tournees.forEach((tournee) => {
        total +=
          Number(tournee.pivot.quantite) * Number(tournee.pivot.prix_vente)
      })
      return total + ' FCFA'
    },
  },
  mounted() {
    this.articles = this.item.produits
    this.decalages.push(this.item.produits.length)
    this.plats = this.item.plats
    this.decalages.push(this.item.plats.length + this.item.produits.length)
    this.cocktails = this.item.cocktails
    this.decalages.push(
      this.item.cocktails.length +
        this.item.plats.length +
        this.item.produits.length
    )
    this.tournees = this.item.tournees
  },
  methods: {
    closeShow() {
      this.dialog = false
    },
  },
}
</script>

<style></style>
