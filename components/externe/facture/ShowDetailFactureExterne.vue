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
          <h5 class="primary--text text--darken-3">PAIEMENTS</h5>
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
      </v-card-text>
      <v-card-text id="printable">
        <v-container>
          <div class="invoice-wrp">
            <div class="invoice-hd">
              <div class="logo">
                <h1>
                  <a href="#" title=""
                    ><img src="/logo.jpg" alt="logo" height="110" width="110"
                  /></a>
                </h1>
              </div>
              <h1 class="green-clr">Facture</h1>
            </div>
            <div class="invoice-dte">
              <span
                >Facture No: <i>{{ item.code }}</i></span
              >
              <span
                >Date: <i>{{ $moment().format('ll') }}</i></span
              >
              <a class="brd-rd5" href="#" title="" @click="printer"
                ><v-icon left>mdi-printer</v-icon> Imprimer</a
              >
            </div>
            <div class="invoice-inf">
              <div class="inf-inr inf-frm">
                <h4>Par</h4>
                <span
                  >Hôtel:
                  <i class="green-clr">Résidence Hotel Krinjabo</i></span
                >
                <span>Address: <i>Yamoussoukro Quartier Millionaire</i></span>
                <span>Phone: <i>+225 00 00 00 00</i></span>
                <span>Cell: <i>+225 00 00 00 00</i></span>
                <span
                  >Paiement dû:
                  <i class="blue-clr">{{
                    $moment().add(5, 'days').format('ll')
                  }}</i></span
                >
              </div>
            </div>
            <div class="invoice-table">
              <table class="table table-bordered">
                <thead class="table-inverse">
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
              </table>
            </div>
            <div class="invoice-total">
              <div class="invoice-total-iner">
                <span
                  >Total: <i>{{ item.montant | formater }}</i></span
                >
              </div>
            </div>
            <p class="note">
              <span>Note:</span> Lorem ipsum dolor sit amet, consectetur
              adipiscing elit.
            </p>
          </div>
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
        styles: [
          'https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.min.css',
          '/css/main.css',
          '/css/materialize.min.css',
          '/css/main.css',
          '/css/responsive.css',
        ],
        timeout: 1000, // default timeout before the print window appears
        autoClose: true, // if false, the window will not close after printing
        windowTitle: 'facture-' + this.item.code, // override the window title
      }
      this.$htmlToPaper('printable', options)
    },
  },
}
</script>
