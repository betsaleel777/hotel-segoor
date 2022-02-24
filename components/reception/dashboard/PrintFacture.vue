<template>
  <v-dialog v-model="dialog" persistent max-width="980px">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" color="primary" text v-on="on">Facture</v-btn>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text"
          >Facture {{ item.chambre_linked.nom }}</span
        >
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text id="printable">
        <!-- entête de facture -->
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
              <a class="brd-rd5" href="#" title="" @click="print"
                ><v-icon left>mdi-printer</v-icon> Imprimer</a
              >
            </div>
            <div class="invoice-inf">
              <div class="inf-inr inf-frm">
                <h4>From</h4>
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
              <div class="inf-inr inf-to">
                <h4>Au client</h4>
                <span
                  >Nom: <i class="blue-clr">{{ fullName }}</i></span
                >
                <span
                  >Address: <i>{{ item.client_linked.domicile }}</i></span
                >
                <span
                  >Phone: <i>{{ item.client_linked.contact }}</i></span
                >
                <span
                  >Email: <i>{{ item.client_linked.email }}</i></span
                >
              </div>
            </div>
            <div class="invoice-table">
              <table class="table table-bordered">
                <thead class="table-inverse">
                  <tr>
                    <th class="text-center">Chambre</th>
                    <th class="text-center">Quantité</th>
                    <th class="text-center">Nuitée</th>
                    <th class="text-center">Total net</th>
                    <th class="text-center">Remise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-center">
                      <span>{{ item.chambre_linked.nom }}</span>
                    </td>
                    <td class="text-center">
                      <span>{{ quantiteNuitee + ' ' }} jours</span>
                    </td>
                    <td class="text-center">
                      <span>{{ item.prix | formater }} FCFA</span>
                    </td>
                    <td class="text-center">
                      <span
                        >{{
                          (item.prix * quantiteNuitee) | formater
                        }}
                        FCFA</span
                      >
                    </td>
                    <td class="text-center">
                      <span
                        >{{ remise | formater }}x{{ quantiteNuitee }} FCFA</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="invoice-total">
              <div class="invoice-total-iner">
                <span
                  >Hôtel: <i>{{ montantAvecRemise | formater }} FCFA</i></span
                >
                <!-- <span>TAX/VAT: <i>$25.6</i></span> -->
              </div>
            </div>
            <div v-if="consommations.length > 0" class="invoice-table">
              <table class="table table-bordered">
                <thead class="table-inverse">
                  <tr>
                    <th class="text-center">Date</th>
                    <th class="text-center">Lieu consommation</th>
                    <th class="text-center">Désignation</th>
                    <th class="text-center">Quantité</th>
                    <th class="text-center">Prix</th>
                    <th class="text-center">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="consommation in consommations"
                    :key="consommation.code"
                  >
                    <td class="text-center">
                      <span>{{
                        $moment(consommation.jour).format('llll')
                      }}</span>
                    </td>
                    <td class="text-center">
                      <span>{{ consommation.lieu }}</span>
                    </td>
                    <td class="text-center">
                      <span>{{ consommation.nom }}</span>
                    </td>
                    <td class="text-center">{{ consommation.quantite }}</td>
                    <td class="text-center">
                      <span>{{ consommation.prix | formater }} FCFA</span>
                    </td>
                    <td class="text-center">
                      <span
                        >{{
                          (consommation.quantite * consommation.prix) | formater
                        }}
                        FCFA</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="invoice-total">
              <div class="invoice-total-iner">
                <span
                  >Extra: <i>{{ totalConsomme | formater }}</i></span
                >
                <!-- <span>TAX/VAT: <i>$25.6</i></span> -->
              </div>
            </div>
            <div class="invoice-total">
              <div class="invc-total">
                <span
                  >TOTAL:
                  <i>{{
                    (totalConsomme + montantAvecRemise) | formater
                  }}</i></span
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
      if (this.item.consommations) {
        const compare = (a, b) => {
          if (this.$moment(a.jour).diff(b.jour) < 0) {
            return -1
          }
          if (this.$moment(a.jour).diff(b.jour) < 0) {
            return 1
          }
          return 0
        }
        const listeCocktails = []
        const listePlats = []
        const listeTournees = []
        const listeProduits = []
        this.item.consommations.forEach((consommation) => {
          let { plats, cocktails, produits, tournees } = consommation
          const { departement } = consommation
          plats = plats.map((item) => {
            return { ...item, departement }
          })
          cocktails = cocktails.map((item) => {
            return { ...item, departement }
          })
          produits = produits.map((item) => {
            return { ...item, departement }
          })
          tournees = tournees.map((item) => {
            return { ...item, departement }
          })
          listePlats.push(...plats)
          listeCocktails.push(...cocktails)
          listeProduits.push(...produits)
          listeTournees.push(...tournees)
        })
        const consommations = [
          ...listeCocktails,
          ...listePlats,
          ...listeProduits,
          ...listeTournees,
        ]
        resultat = consommations.map((item) => {
          return {
            jour: item.pivot.created_at,
            code: item.code,
            nom: item.nom ?? item.titre,
            quantite: item.pivot.quantite,
            prix: item.pivot.prix_vente,
            lieu: item.departement === 1 ? 'restaurant' : 'bar',
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

<style scoped></style>
