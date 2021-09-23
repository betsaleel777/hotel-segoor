<template>
  <v-dialog v-model="dialog" persistent max-width="800px">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" color="primary" text v-on="on">Facture</v-btn>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Facture {{ item.code }}</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="dialog = false">
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
            <v-col cols="3"> <b>Client:</b> {{ fullName }} </v-col>
            <v-col cols="3"
              ><b>Contact:</b> {{ item.client_linked.contact }}</v-col
            >
            <v-col cols="3"
              ><span v-if="item.client_linked.email"
                ><b>Email:</b> {{ item.client_linked.email }}</span
              ></v-col
            >
            <v-col cols="3">
              <span v-if="item.client_linked.domicile"
                ><b>Domicile:</b> {{ item.client_linked.domicile }}</span
              >
            </v-col>
            <v-col cols="12">
              <div class="text-center">
                <h3 class="primary--text text--darken-3">HEBERGEMENT</h3>
              </div>
              <v-simple-table>
                <template #default>
                  <thead>
                    <tr>
                      <th class="text-center">Chambre</th>
                      <th class="text-center">Quantité</th>
                      <th class="text-center">Nuitée</th>
                      <th class="text-center">Total sans Remise</th>
                      <th class="text-center">Remise</th>
                      <th class="text-center">Total avec Remise</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="text-center">
                        {{ item.chambre_linked.nom }}
                      </td>
                      <td class="text-center">
                        {{ quantiteNuitee + ' ' }}
                        jours
                      </td>
                      <td class="text-center">
                        {{ item.prix | formater }} FCFA
                      </td>
                      <td class="text-center">
                        {{ (item.prix * quantiteNuitee) | formater }} FCFA
                      </td>
                      <td class="text-center">
                        {{ remise | formater }}x{{ quantiteNuitee }} FCFA
                      </td>
                      <td class="text-center">
                        <b>{{ montantAvecRemise | formater }} FCFA</b>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
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
                        <b>{{ totalConsomme | formater }} FCFA</b>
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
                  {{ (totalConsomme + montantAvecRemise) | formater }} FCFA
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
        <v-btn
          :disabled="
            totalConsomme + montantAvecRemise !== total ||
            item.status === 'libérée'
          "
          color="primary"
          text
          @click="liberer"
        >
          Libérer
        </v-btn>
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
      return `${Intl.NumberFormat().format(value)}`
    },
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    total: {
      type: Number,
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
        nature = 'PASSEPORT'
      }
      return nature + ' ' + client.pieces[0].numero_piece
    },
    nuiteeAvecRemise() {
      return Math.round(this.item.prix * (1 - this.item.remise / 100))
    },
    quantiteNuitee() {
      return this.$moment(this.item.sortie).diff(this.item.entree, 'days')
    },
    montantAvecRemise() {
      if (this.item) {
        return this.nuiteeAvecRemise * this.quantiteNuitee
      } else {
        return null
      }
    },
    remise() {
      return Math.round((this.item.prix * this.item.remise) / 100)
    },
    remiseTotal() {
      return this.remise * this.quantiteNuitee
    },
    totalConsomme() {
      let total = 0
      if (this.consommations.length > 0) {
        this.consommations.forEach((item) => {
          total += item.prix * item.quantite
        })
      }
      return total
    },
  },
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
    liberer() {
      this.$axios
        .put('reception/attributions/free/' + this.item.id)
        .then((result) => {
          this.$notifier.show({ text: result.data.message, variant: 'success' })
          this.$emit('free')
        })
    },
  },
}
</script>

<style></style>
