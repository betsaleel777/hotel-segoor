<template>
  <v-dialog v-model="dialog" persistent max-width="800px">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" color="green darken-1" text v-on="on"
        >Facture</v-btn
      >
    </template>
    <v-card>
      <v-card-title>
        <span class="headline primary--text"
          >Facture {{ encaissement.code }}</span
        >
      </v-card-title>
      <v-card-text id="printable">
        <!-- entête de facture -->
        <v-container>
          <v-row>
            <v-col cols="12">
              <div class="text-center">
                <h2 class="black--text">Facture {{ encaissement.code }}</h2>
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
                  {{ encaissement.client_linked.contact }}
                </h5>
                <h5 class="black--text">
                  {{ encaissement.client_linked.email }}
                </h5>
                <h5 class="black--text">
                  {{ encaissement.client_linked.domicile }}
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
                  Chambre {{ encaissement.chambre_linked.nom }}
                </h5>
                <h5 class="black--text">
                  Montant Nuitée: {{ encaissement.chambre_linked.prix_vente }} F
                </h5>
                <h5 class="black--text">
                  Du: {{ $moment(encaissement.entree).format('ll') }} au
                  {{ $moment(encaissement.sortie).format('ll') }}
                </h5>
                <h5 v-if="encaissement.remise.length > 0" class="black--text">
                  Remise {{ encaissement.remise }} %
                </h5>
                <h5 class="black--text">
                  Montant Hébergement: {{ montant }} F
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
                    <tr v-for="item in consommations" :key="item.code">
                      <td class="text-center">
                        {{ $moment(item.jour).format('llll') }}
                      </td>
                      <td class="text-center">{{ item.code }}</td>
                      <td class="text-left">{{ item.nom }}</td>
                      <td class="text-center">{{ item.quantite }}</td>
                      <td class="text-right">{{ item.prix }}</td>
                      <td class="text-right">
                        {{ item.quantite * item.prix }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="5"><b>Total</b></td>
                      <td class="text-right">
                        <b>{{ total }}</b>
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
        <v-btn color="blue darken-1" text @click="dialog = false">
          Fermer
        </v-btn>
        <v-btn color="blue darken-1" text @click="print"> Imprimer </v-btn>
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
    encaissement: {
      type: Object,
      required: true,
    },
  },
  data: () => {
    return {
      dialog: false,
      consommations: [],
    }
  },
  computed: {
    fullName() {
      return (
        this.encaissement.client_linked.nom +
        ' ' +
        this.encaissement.client_linked.prenom
      )
    },
    pieceInfos() {
      const client = this.encaissement.client_linked
      let nature = 'CNI'
      if (client.pieces[0].nature !== 'cni') {
        nature = 'passeport'
      }
      return nature + ' ' + client.pieces[0].numero_piece
    },
    montant() {
      return (
        this.encaissement.prix *
        (1 - this.encaissement.remise / 100) *
        this.$moment(this.encaissement.sortie).diff(
          this.encaissement.entree,
          'days'
        )
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
  mounted() {
    const compare = (a, b) => {
      if (this.$moment(a.jour).diff(b.jour) < 0) {
        return -1
      }
      if (this.$moment(a.jour).diff(b.jour) < 0) {
        return 1
      }
      return 0
    }
    const {
      cocktails,
      plats,
      produits,
      tournees,
    } = this.encaissement.consommation
    const consommations = [...cocktails, ...plats, ...produits, ...tournees]
    this.consommations = consommations.map((item) => {
      return {
        jour: item.pivot.created_at,
        code: item.code,
        nom: item.nom ?? item.titre,
        quantite: item.pivot.quantite,
        prix: item.pivot.prix_vente,
      }
    })
    this.consommations = this.consommations.sort(compare)
  },
  methods: {
    print() {
      const options = {
        name: '_blank',
        specs: ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
        styles: ['https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.min.css'],
        timeout: 1000, // default timeout before the print window appears
        autoClose: true, // if false, the window will not close after printing
        windowTitle: 'facture-' + this.encaissement.code, // override the window title
      }
      this.$htmlToPaper('printable', options)
    },
  },
}
</script>

<style></style>
