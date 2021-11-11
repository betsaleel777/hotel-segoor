<template>
  <v-dialog v-model="dialogue" persistent max-width="980px">
    <template #activator="{ on: dialog, attrs }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            v-bind="attrs"
            color="pink"
            elevation="1"
            icon
            fab
            dark
            x-small
            v-on="{ ...tooltip, ...dialog }"
          >
            <v-icon small>mdi-eye</v-icon>
          </v-btn>
        </template>
        <span>visualiser</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Détails de facture</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="dialogue = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div class="text-center mt-3">
          <h3 class="primary--text text--darken-3">PAIEMENTS</h3>
        </div>
        <v-simple-table>
          <template #default>
            <thead>
              <tr>
                <th class="text-center">Date</th>
                <th class="text-center">Moyen</th>
                <th class="text-right">Montant perçu</th>
                <th class="text-right">Monnaie rendue</th>
                <th class="text-right">Montant encaissé</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="element in item.paiements" :key="element.id">
                <td class="text-center">
                  {{ $moment(element.created_at).format('llll') }}
                </td>
                <td class="text-center">{{ moyenDePaiement(element) }}</td>
                <td class="text-right">{{ element.montant }} FCFA</td>
                <td class="text-right">{{ element.monnaie }} FCFA</td>
                <td class="text-right">
                  {{ Number(element.montant) - Number(element.monnaie) }}
                  FCFA
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" class="text-right">
                  <b>Total versé</b>
                </td>
                <td class="text-right">
                  <b>{{ item.verse }}</b>
                </td>
              </tr>
            </tfoot>
          </template>
        </v-simple-table>
        <v-divider color="secondary"></v-divider>
      </v-card-text>
      <v-card-text id="printable">
        <!-- entête de facture -->
        <v-container>
          <v-row>
            <v-col cols="12">
              <div class="text-center">
                <h2 class="black--text">Facture {{ item.code }}</h2>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="text-left">
                <h4 class="black--text">
                  {{ $moment().format('ll') }}
                </h4>
                <h4 class="black--text">Maison d'hôte Krinjabo,</h4>
                <h4 class="black--text">Yamoussoukro, Quartier Millionaire</h4>
                <h4 class="black--text">numero1/numero2</h4>
                <h4 class="black--text">votremail@krinjabo.com</h4>
              </div>
            </v-col>
            <v-col cols="3"></v-col>
            <v-col cols="3">
              <v-img width="170" height="170" src="/segoor.jpg"></v-img>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <!-- corps de facture -->
        <v-container>
          <v-row>
            <v-col cols="12">
              <div class="text-center">
                <h3 class="primary--text text--darken-3">CONSOMMATION</h3>
              </div>
              <v-simple-table>
                <template #default>
                  <thead>
                    <tr>
                      <th class="text-center">Date</th>
                      <th class="text-left">Désignation</th>
                      <th class="text-center">Quantité</th>
                      <th class="text-right">Prix</th>
                      <th class="text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="consommation in consommations"
                      :key="consommation.code"
                    >
                      <td class="text-center">
                        {{ $moment(consommation.jour).format('llll') }}
                      </td>
                      <td class="text-left">{{ consommation.nom }}</td>
                      <td class="text-center">{{ consommation.quantite }}</td>
                      <td class="text-right">
                        {{ consommation.prix | formater }} FCFA
                      </td>
                      <td class="text-right">
                        {{
                          (consommation.quantite * consommation.prix) | formater
                        }}
                        FCFA
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td class="text-right" colspan="4"><b>Total</b></td>
                      <td class="text-right">
                        <b>{{ item.montant | formater }} FCFA</b>
                      </td>
                    </tr>
                  </tfoot>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <!-- pieds de facture -->
        <v-container>
          <v-row>
            <v-col cols="12">
              <small>information de bas de facture à mettre</small>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="printer"
          ><v-icon left>mdi-printer</v-icon>imprimer</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import Vue from 'vue'
import VueHtmlToPaper from 'vue-html-to-paper'

Vue.use(VueHtmlToPaper)
export default {
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialogue: false,
      consommations: [],
    }
  },
  computed: {},
  created() {
    this.consommations = this.item.selected.map((element) => {
      return {
        code: element.code,
        nom: element.nom,
        jour: element.created_at,
        quantite: element.pivot.quantite,
        prix: element.pivot.prix_vente,
      }
    })
  },
  methods: {
    moyenDePaiement(element) {
      if (element.moyen) {
        return element.moyen.nom
      } else if (element.espece) {
        return 'espèce'
      } else {
        return 'cheque ' + element.cheque
      }
    },
    printer() {
      const options = {
        name: '_blank',
        specs: ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
        styles: ['https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.min.css'],
        timeout: 1000, // default timeout before the print window appears
        autoClose: true, // if false, the window will not close after printing
        windowTitle: 'facture-' + this.item.code, // override the window title
      }
      this.$htmlToPaper('printable', options)
    },
  },
}
</script>
