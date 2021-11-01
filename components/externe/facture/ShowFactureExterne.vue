<template>
  <v-dialog v-model="dialogue" max-width="850px">
    <template #activator="{ on: dialog }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            elevation="1"
            icon
            fab
            dark
            x-small
            color="pink"
            v-on="{ ...tooltip, ...dialog }"
            @click="getItem"
          >
            <v-icon small> mdi-eye </v-icon>
          </v-btn>
        </template>
        <span>visualiser</span>
      </v-tooltip>
    </template>
    <v-card v-if="facture">
      <v-card-title class="justify-center primary--text headline grey lighten-2"
        ><div>
          Facture {{ facture.code }} du
          {{ $moment(facture.created_at).format('ll') }}
        </div>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="dialogue = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text justify="center" align="center">
        <div class="text-center mt-3">
          <h3>Articles consommés</h3>
        </div>
        <v-simple-table>
          <template #default>
            <thead>
              <tr>
                <th class="text-center">Réference</th>
                <th class="text-center">Description</th>
                <th class="text-center">Quantité</th>
                <th class="text-right">Prix de vente</th>
                <th class="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(article, index) in facture.selected"
                :key="index"
                dense
              >
                <td class="text-center">{{ article.code }}</td>
                <td class="text-center">
                  {{ article.nom }}
                </td>
                <td class="text-center">{{ article.pivot.quantite }}</td>
                <td class="text-right">
                  {{ article.pivot.prix_vente | formater }}
                </td>
                <td class="text-right">
                  <b>{{
                    (article.pivot.quantite * article.pivot.prix_vente)
                      | formater
                  }}</b>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" class="text-right"><b>Total</b></td>
                <td class="text-right">
                  <b>{{ calculTotal | formater }}</b>
                </td>
              </tr>
            </tfoot>
          </template>
        </v-simple-table>
        <v-container>
          <div class="text-center mt-5">
            <h3>Liste des Paiements</h3>
          </div>
          <v-simple-table>
            <template #default>
              <thead>
                <tr>
                  <th class="text-left">Date</th>
                  <th class="text-center">Moyen</th>
                  <th class="text-right">Montant perçu</th>
                  <th class="text-right">Monnaie rendue</th>
                  <th class="text-right">Montant encaissé</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="versement in facture.paiements" :key="versement.id">
                  <td class="text-left">
                    {{ $moment(versement.created_at).format('llll') }}
                  </td>
                  <td class="text-center">{{ moyenDePaiement(versement) }}</td>
                  <td class="text-right">
                    {{ versement.montant | formater }} FCFA
                  </td>
                  <td class="text-right">
                    {{ versement.monnaie | formater }} FCFA
                  </td>
                  <td class="text-right">
                    <b>{{
                      (Number(versement.montant) - Number(versement.monnaie))
                        | formater
                    }}</b>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="4" class="text-right">
                    <b>Total versé</b>
                  </td>
                  <td class="text-right">
                    <b>{{ facture.verse | formater }} FCFA</b>
                  </td>
                </tr>
              </tfoot>
            </template>
          </v-simple-table>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="dialogue = false">Fermer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    dialogue: false,
    facture: null,
  }),
  computed: {
    calculTotal() {
      let total = 0
      this.facture.selected.forEach((select) => {
        total += Number(select.pivot.quantite) * Number(select.pivot.prix_vente)
      })
      return total
    },
  },
  methods: {
    ...mapActions({ getFacture: 'externe/facture/getItem' }),
    getItem() {
      this.getFacture(this.id).then((facture) => {
        this.facture = facture
      })
    },
    moyenDePaiement(item) {
      if (item.moyen) {
        return item.moyen.nom
      } else if (item.espece) {
        return 'espèce'
      } else {
        return item.cheque
      }
    },
  },
}
</script>

<style></style>
