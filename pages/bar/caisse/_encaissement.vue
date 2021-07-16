<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Recu
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-gestion-bar />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-container id="toprint">
                <v-row>
                  <!-- entetete -->
                  <v-col cols="4">
                    <div class="text-left">
                      {{ encaissement.code }}
                    </div>
                  </v-col>
                  <v-col cols="4"></v-col>
                  <v-col cols="4">
                    <div class="text-right">
                      {{ $moment(encaissement.created_at).format('ll') }}
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <v-divider></v-divider>
                  </v-col>
                  <!-- corps -->
                  <v-col cols="12">
                    <div class="text-left">
                      <span v-if="encaissement.attribution">
                        <h4>
                          {{
                            encaissement.attribution_linked.client_linked.nom
                          }}
                        </h4>
                        <h4></h4>
                      </span>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <v-simple-table dense>
                      <template #default>
                        <thead>
                          <th class="text-left">Référence</th>
                          <th class="text-left">Désignation</th>
                          <th class="text-right">Prix Unitaire</th>
                          <th class="text-right">Quantité</th>
                          <th class="text-right">Montant</th>
                        </thead>
                        <tbody
                          v-if="
                            Array.isArray(encaissement.plats) &&
                            encaissement.plats.length > 0
                          "
                        >
                          <tr v-for="plat in encaissement.plats" :key="plat.id">
                            <td class="text-left">{{ plat.code }}</td>
                            <td class="text-left">{{ plat.nom }}</td>
                            <td class="text-right">
                              {{ plat.pivot.prix_vente }}
                            </td>
                            <td class="text-right">
                              {{ plat.pivot.quantite }}
                            </td>
                            <td class="text-right">
                              {{
                                Number(plat.pivot.prix_vente) *
                                Number(plat.pivot.quantite)
                              }}
                            </td>
                          </tr>
                        </tbody>
                        <tbody
                          v-if="
                            Array.isArray(encaissement.tournees) &&
                            encaissement.tournees.length > 0
                          "
                        >
                          <tr
                            v-for="tournee in encaissement.tournees"
                            :key="tournee.id"
                          >
                            <td class="text-left">{{ tournee.code }}</td>
                            <td class="text-left">{{ tournee.titre }}</td>
                            <td class="text-right">
                              {{ tournee.pivot.prix_vente }}
                            </td>
                            <td class="text-right">
                              {{ tournee.pivot.quantite }}
                            </td>
                            <td class="text-right">
                              {{
                                Number(tournee.pivot.prix_vente) *
                                Number(tournee.pivot.quantite)
                              }}
                            </td>
                          </tr>
                        </tbody>
                        <tbody
                          v-if="
                            Array.isArray(encaissement.cocktails) &&
                            encaissement.cocktails.length > 0
                          "
                        >
                          <tr
                            v-for="cocktail in encaissement.cocktails"
                            :key="cocktail.id"
                          >
                            <td class="text-left">{{ cocktail.code }}</td>
                            <td class="text-left">{{ cocktail.nom }}</td>
                            <td class="text-right">
                              {{ cocktail.pivot.prix_vente }}
                            </td>
                            <td class="text-right">
                              {{ cocktail.pivot.quantite }}
                            </td>
                            <td class="text-right">
                              {{
                                Number(cocktail.pivot.prix_vente) *
                                Number(cocktail.pivot.quantite)
                              }}
                            </td>
                          </tr>
                        </tbody>
                        <tbody
                          v-if="
                            Array.isArray(encaissement.produits) &&
                            encaissement.produits.length > 0
                          "
                        >
                          <tr
                            v-for="produit in encaissement.produits"
                            :key="produit.id"
                          >
                            <td class="text-left">{{ produit.code }}</td>
                            <td class="text-left">{{ produit.nom }}</td>
                            <td class="text-right">
                              {{ produit.pivot.prix_vente }}
                            </td>
                            <td class="text-right">
                              {{ produit.pivot.quantite }}
                            </td>
                            <td class="text-right">
                              {{
                                Number(produit.pivot.prix_vente) *
                                Number(produit.pivot.quantite)
                              }}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colspan="4" class="text-left">
                              <b>Total à payer</b>
                            </td>
                            <td class="text-right">{{ total }}</td>
                          </tr>
                        </tfoot>
                      </template>
                    </v-simple-table>
                  </v-col>
                  <!-- pieds de page -->
                  <v-col cols="12">
                    <v-divider></v-divider>
                    <small>Krinjabo maison d'hôte yamoussoukro</small>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" dark absolute bottom right fab @click="print">
            <v-icon>mdi-printer</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import SideGestionBar from '~/components/bar/SideGestionBar.vue'
export default {
  components: {
    SideGestionBar,
  },
  data() {
    return {
      encaissement: {},
      total: 0,
    }
  },
  async fetch() {
    const requete = await this.$axios.get(
      'caisses/encaissements/' + this.$route.params.encaissement
    )
    this.encaissement = requete.data.encaissement
    const { produits, cocktails, plats, tournees } = this.encaissement
    const achats = [...produits, ...cocktails, ...plats, ...tournees]
    let montant = 0
    achats.forEach((ligne) => {
      montant += Number(ligne.pivot.quantite) * Number(ligne.pivot.prix_vente)
    })
    this.total = montant
  },
  methods: {
    print() {
      this.$htmlToPaper('toprint')
    },
  },
}
</script>

<style></style>
