<template>
  <v-dialog v-model="dialog" persistent max-width="980">
    <v-card v-if="Object.keys(details).length > 0">
      <v-card-title class="grey lighten-2">
        <div class="headline primary--text">
          Détails de l'hébergement,Chambre
          {{ details.chambre_linked.nom }}
        </div>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <div class="text-left">
                <h5 :class="getStatusColor">
                  <b>{{ details.status }}</b>
                </h5>
                <p>
                  <b>Client:</b> {{ fullName }} <br />
                  <b>Contact:</b> {{ details.client_linked.contact }}
                </p>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="text-right">
                <h5>
                  <b>{{ $moment(details.created_at).format('ll') }}</b>
                </h5>
              </div>
            </v-col>
            <v-col cols="12">
              <!-- hébergement -->
              <div class="text-center">
                <h5 class="primary--text">Hébergement</h5>
              </div>
              <v-container>
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
                          {{ details.chambre_linked.nom }}
                        </td>
                        <td class="text-center">
                          {{ quantiteNuitee + ' ' }}
                          jours
                        </td>
                        <td class="text-center">
                          {{ details.prix | formater }} FCFA
                        </td>
                        <td class="text-center">
                          {{ (details.prix * quantiteNuitee) | formater }} FCFA
                        </td>
                        <td class="text-center">
                          {{ remise | formater }}x{{ quantiteNuitee }}
                          FCFA
                        </td>
                        <td class="text-center">
                          <b>{{ montantAvecRemise | formater }} FCFA</b>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-container>
              <div class="text-center">
                <h5 class="primary--text">Consommation</h5>
              </div>
              <v-container v-if="consommations.length === 0">
                <v-alert outlined type="info" prominent border="right">
                  Le client n'as encore rien consommé
                </v-alert>
              </v-container>
              <v-container v-else>
                <v-simple-table>
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-center">Date</th>
                        <th class="text-center">Lieu consommation</th>
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
                        <td class="text-center">
                          {{ item.lieu }}
                        </td>
                        <td class="text-left">{{ item.nom }}</td>
                        <td class="text-center">{{ item.quantite }}</td>
                        <td class="text-right">
                          {{ item.prix | formater }} FCFA
                        </td>
                        <td class="text-right">
                          {{ (item.quantite * item.prix) | formater }} FCFA
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td class="text-right" colspan="5">
                          <b>Total de consommation</b>
                        </td>
                        <td class="text-right">
                          <b>{{ total | formater }} FCFA</b>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-right" colspan="5">
                          <b>Frais d'hôtel</b>
                        </td>
                        <td class="text-right">
                          <b
                            >{{
                              (total + montantAvecRemise) | formater
                            }}
                            FCFA</b
                          >
                        </td>
                      </tr>
                    </tfoot>
                  </template>
                </v-simple-table>
              </v-container>
              <div class="text-center">
                <h5 class="primary--text">Paiements</h5>
              </div>
              <v-container v-if="!paiementExist">
                <v-alert outlined type="info" prominent border="right">
                  Aucun paiement n'as déjà été effectué
                </v-alert>
              </v-container>
              <v-container v-else>
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
                      <tr v-for="item in versements" :key="item.id">
                        <td class="text-left">
                          {{ $moment(item.created_at).format('llll') }}
                        </td>
                        <td class="text-center">{{ moyenDePaiement(item) }}</td>
                        <td class="text-right">
                          {{ item.montant | formater }} FCFA
                        </td>
                        <td class="text-right">
                          {{ item.monnaie | formater }} FCFA
                        </td>
                        <td class="text-right">
                          {{
                            (Number(item.montant) - Number(item.monnaie))
                              | formater
                          }}
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
                          <b>{{ totalVerse | formater }} FCFA</b>
                        </td>
                      </tr>
                    </tfoot>
                  </template>
                </v-simple-table>
              </v-container>
            </v-col>
            <v-col cols="12">
              <div class="text-right">
                <h6 class="pink--text darken-3">
                  Montant total à payer:
                  {{ reste | formater }} FCFA
                </h6>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click.stop="dialog = false">Fermer</v-btn>
        <paiement-reception
          v-if="details.status !== 'libérée'"
          v-can="'accès paiements réception'"
          :reception="details"
          :total="totalVerse"
          :consommation="total"
          @new-versement="pushVersement"
          @paid="onPaid"
        />
        <print-facture :item="details" :total="totalVerse" @free="onFree" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import PaiementReception from './PaiementReception.vue'
import PrintFacture from './PrintFacture.vue'
export default {
  components: {
    PrintFacture,
    PaiementReception,
  },
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)}`
    },
  },
  props: {
    details: {
      type: Object,
      default: () => {
        return {}
      },
    },
    value: Boolean,
  },
  data: () => ({
    paiementExist: false,
  }),
  computed: {
    versements() {
      let result = null
      if (this.details.encaissement) {
        result = this.details.encaissement.versements
      } else {
        result = []
      }
      return result
    },
    fullName() {
      return (
        this.details.client_linked.nom + ' ' + this.details.client_linked.prenom
      )
    },
    consommations() {
      let resultat = []
      if (this.details.consommations) {
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
        this.details.consommations.forEach((consommation) => {
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
    getStatusColor() {
      if (this.details) {
        if (this.details.status === 'occupée') {
          return 'red--text'
        } else {
          return 'green--text'
        }
      } else {
        return null
      }
    },
    nuiteeAvecRemise() {
      return Math.round(this.details.prix * (1 - this.details.remise / 100))
    },
    quantiteNuitee() {
      return this.$moment(this.details.sortie).diff(this.details.entree, 'days')
    },
    montantAvecRemise() {
      if (this.details) {
        return this.nuiteeAvecRemise * this.quantiteNuitee
      } else {
        return null
      }
    },
    remise() {
      return Math.round((this.details.prix * this.details.remise) / 100)
    },
    remiseTotal() {
      return this.remise * this.quantiteNuitee
    },
    totalVerse() {
      let resultat = 0
      this.versements.forEach((versement) => {
        resultat += versement.montant - versement.monnaie
      })
      return resultat
    },
    total() {
      let resultat = 0
      if (this.consommations.length > 0) {
        this.consommations.forEach((item) => {
          resultat += item.prix * item.quantite
        })
      }
      return resultat
    },
    montantApayer() {
      return this.total + this.montantAvecRemise
    },
    reste() {
      return this.montantApayer - this.totalVerse
    },
    dialog: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  mounted() {
    this.paiementExist = this.versements.length > 0
  },
  methods: {
    moyenDePaiement(item) {
      if (item.mobile) {
        return item.mobile.nom
      } else if (item.espece) {
        return 'espèce'
      } else {
        return item.cheque
      }
    },
    pushVersement(versement) {
      this.versements.push(versement)
      this.$root.$emit('new-payement')
      this.paiementExist = true
    },
    onPaid(versement) {
      this.versements.push(versement)
      this.$root.$emit('new-payement')
      this.dialog = false
    },
    onFree() {
      this.dialog = false
      this.$emit('refresh')
    },
  },
}
</script>

<style></style>
