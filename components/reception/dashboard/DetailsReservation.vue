<template>
  <v-dialog v-model="dialog" persistent max-width="800">
    <v-card v-if="Object.keys(details).length > 0">
      <v-card-title class="grey lighten-2">
        <div class="headline primary--text">
          Hébergement chambre,
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
                <h2 :class="getStatusColor">{{ details.status }}</h2>
                <p>
                  <b>Client:</b> {{ fullName }} <br />
                  <b>Contact:</b> {{ details.client_linked.contact }}
                </p>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="text-right">
                <h3>{{ $moment(details.created_at).format('ll') }}</h3>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-center">
                <h2 class="primary--text">Hébergement</h2>
              </div>
              <v-container>
                <v-container>
                  <v-simple-table>
                    <template #default>
                      <thead>
                        <tr>
                          <th class="text-center">Chambre</th>
                          <th class="text-center">Quantité</th>
                          <th class="text-right">Nuitée</th>
                          <th class="text-right">Montant</th>
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
                          <td class="text-right">{{ details.prix }} FCFA</td>
                          <td class="text-right">
                            <b>{{ montant }} FCFA</b>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-container>
              </v-container>
              <div class="text-center">
                <h2 class="primary--text">Paiements du Client</h2>
              </div>
              <v-container v-if="versements.length === 0">
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
                        <td class="text-right">{{ item.montant }} FCFA</td>
                        <td class="text-right">{{ item.monnaie }} FCFA</td>
                        <td class="text-right">
                          {{ Number(item.montant) - Number(item.monnaie) }}
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
                          <b>{{ totalVerse }} FCFA</b>
                        </td>
                      </tr>
                    </tfoot>
                  </template>
                </v-simple-table>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click.stop="dialog = false">Fermer</v-btn>
        <attribute-reservation
          v-if="attribuable"
          :item="details"
          @reservation-converted="onConvert"
        />
        <paiement-reservation
          v-can="'accès paiements réception'"
          :reservation="details"
          :total="totalVerse"
          @new-versement="pushVersement"
          @paid="onPaid"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import AttributeReservation from './AttributeReservation.vue'
import PaiementReservation from './PaiementReservation.vue'
export default {
  components: {
    PaiementReservation,
    AttributeReservation,
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
    attribuable: true,
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
    getStatusColor() {
      // console.log(this.details)
      if (this.status === 'impayée') {
        return 'red--text'
      } else if (this.status === 'en cours') {
        return 'blue--text'
      } else {
        return 'green--text'
      }
    },
    fullName() {
      return (
        this.details.client_linked.nom + ' ' + this.details.client_linked.prenom
      )
    },
    quantiteNuitee() {
      return this.$moment(this.details.sortie).diff(this.details.entree, 'days')
    },
    montant() {
      if (this.details) {
        return this.details.prix * this.quantiteNuitee
      } else {
        return null
      }
    },
    montantApayer() {
      if (this.details) {
        return this.details.prix * this.quantiteNuitee
      } else {
        return 0
      }
    },
    totalVerse() {
      let total = 0
      this.versements.forEach((versement) => {
        total += versement.montant - versement.monnaie
      })
      return total
    },
    status() {
      let result = 'impayée'
      if (this.details.encaissement) {
        result = this.details.encaissement.status
      }
      return result
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
    },
    onPaid(versement) {
      this.versements.push(versement)
      this.dialog = false
    },
    onConvert() {
      this.$emit('refresh')
    },
  },
}
</script>

<style></style>
