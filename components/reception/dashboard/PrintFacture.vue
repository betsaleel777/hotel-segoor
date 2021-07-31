<template>
  <v-dialog v-model="dialog" persistent max-width="800px">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" color="primary" text v-on="on">Facture</v-btn>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Facture {{ item.code }}</span>
        <v-spacer></v-spacer>
        <v-btn color="error" fab x-small dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
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
            <v-col cols="5">
              <!-- <div class="text-center">
                <h4 class="black--text">Facture Adressée à</h4>
              </div> -->
              <div class="text-left">
                <h5 class="black--text">{{ fullName }}</h5>
                <h5 class="black--text">{{ pieceInfos }}</h5>
                <h5 class="black--text">
                  {{ item.client_linked.contact }}
                </h5>
                <h5 class="black--text">
                  {{ item.client_linked.email }}
                </h5>
                <h5 class="black--text">
                  {{ item.client_linked.domicile }}
                </h5>
              </div>
            </v-col>
            <v-col cols="2"></v-col>
            <v-col cols="5">
              <!-- <div class="text-center">
                <h4 class="black--text">Hébergement</h4>
              </div> -->
              <div class="text-right">
                <h5 class="black--text">
                  Chambre {{ item.chambre_linked.nom }}
                </h5>
                <h5 class="black--text">
                  Montant Nuitée: {{ item.chambre_linked.prix_vente }} FCFA
                </h5>
                <h5 class="black--text">
                  Du: {{ $moment(item.entree).format('ll') }} au
                  {{ $moment(item.sortie).format('ll') }}
                </h5>
                <h5 v-if="item.remise" class="black--text">
                  Remise {{ item.remise }} %
                </h5>
                <h5 class="black--text">
                  Montant Hébergement: {{ montant }} FCFA
                </h5>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-center">
                <h2 class="primary--text text--darken-3">CONSOMMATION</h2>
              </div>
              <v-simple-table>
                <template #default>
                  <thead>
                    <tr>
                      <th class="text-center">Date</th>
                      <th class="text-center">Code</th>
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
                      <td class="text-center">{{ consommation.code }}</td>
                      <td class="text-left">{{ consommation.nom }}</td>
                      <td class="text-center">{{ consommation.quantite }}</td>
                      <td class="text-right">{{ consommation.prix }}</td>
                      <td class="text-right">
                        {{ consommation.quantite * consommation.prix }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="5"><b>Total</b></td>
                      <td class="text-right">
                        <!-- <b>{{ total }}</b> -->
                      </td>
                    </tr>
                  </tfoot>
                </template>
              </v-simple-table>
            </v-col>
            <v-col cols="12">
              <div class="text-right">
                <h3 class="pink--text darken-3">
                  Montant total à payer:
                  {{ total + montant }}
                </h3>
              </div>
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
        <v-btn color="error" text @click="dialog = false"> Fermer </v-btn>
        <v-btn color="success" text @click="print"> Imprimer </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
import VueHtmlToPaper from 'vue-html-to-paper'

Vue.use(VueHtmlToPaper)
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => {
    return {
      dialog: false,
    }
  },
  computed: {
    fullName() {
      return this.item.client_linked.nom + ' ' + this.item.client_linked.prenom
    },
    consommations() {
      let resultat = []
      if (this.item.consommation) {
        const compare = (a, b) => {
          if (this.$moment(a.jour).diff(b.jour) < 0) {
            return -1
          }
          if (this.$moment(a.jour).diff(b.jour) < 0) {
            return 1
          }
          return 0
        }
        const { cocktails, plats, produits, tournees } = this.item.consommation
        const consommations = [...cocktails, ...plats, ...produits, ...tournees]
        resultat = consommations.map((item) => {
          return {
            jour: item.pivot.created_at,
            code: item.code,
            nom: item.nom ?? item.titre,
            quantite: item.pivot.quantite,
            prix: item.pivot.prix_vente,
          }
        })
        resultat = resultat.sort(compare)
      }
      return resultat
    },
    pieceInfos() {
      const client = this.item.client_linked
      let nature = 'CNI'
      if (client.pieces[0].nature !== 'cni') {
        nature = 'passeport'
      }
      return nature + ' ' + client.pieces[0].numero_piece
    },
    montant() {
      return (
        this.item.prix *
        (1 - this.item.remise / 100) *
        this.$moment(this.item.sortie).diff(this.item.entree, 'days')
      )
    },
    total() {
      let total = 0
      if (this.consommations.length > 0) {
        this.consommations.forEach((item) => {
          total += item.prix * item.quantite
        })
      }
      return total
    },
  },
  // mounted() {
  //   if (this.item.consommations) {
  //     const compare = (a, b) => {
  //       if (this.$moment(a.jour).diff(b.jour) < 0) {
  //         return -1
  //       }
  //       if (this.$moment(a.jour).diff(b.jour) < 0) {
  //         return 1
  //       }
  //       return 0
  //     }
  //     const { cocktails, plats, produits, tournees } = this.item.consommation
  //     const consommations = [...cocktails, ...plats, ...produits, ...tournees]
  //     this.consommations = consommations.map((item) => {
  //       return {
  //         jour: item.pivot.created_at,
  //         code: item.code,
  //         nom: item.nom ?? item.titre,
  //         quantite: item.pivot.quantite,
  //         prix: item.pivot.prix_vente,
  //       }
  //     })
  //     this.consommations = this.consommations.sort(compare)
  //   }
  // },
  methods: {
    print() {
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

<style></style>
