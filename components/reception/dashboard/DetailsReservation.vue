<template>
  <v-dialog v-model="dialog" persistent max-width="800">
    <v-card v-if="Object.keys(details).length > 0">
      <v-card-title class="grey lighten-2">
        <div class="headline primary--text">
          Détails de l'hébergement {{ details.code }}
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
                <h2 :class="getStatusColor">{{ status }}</h2>
                <span>
                  <h4>
                    {{
                      details.client_linked.nom +
                      ' ' +
                      details.client_linked.prenom
                    }}
                  </h4>
                  <h4>{{ details.client_linked.contact }}</h4>
                  <h4>Chambre: {{ details.chambre_linked.nom }}</h4>
                  <h4>Accompagnants: {{ details.accompagnants }}</h4>
                </span>
              </div>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="6">
              <div class="text-right">
                <h3>{{ $moment(details.created_at).format('ll') }}</h3>
                <span>
                  <h4>Nuitée: {{ details.prix }} FCFA</h4>
                  <h4>
                    Du:
                    {{ $moment(details.entree).format('ll') }} au
                    {{ $moment(details.sortie).format('ll') }}
                  </h4>
                  <h4>Montant: {{ montant }} FCFA</h4>
                </span>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-center">
                <h2 class="primary--text">Versements du Client</h2>
              </div>
              <v-container v-if="versements.length === 0">
                <v-alert outlined type="info" prominent border="right">
                  Aucun versement n'as déjà été effectué
                </v-alert>
              </v-container>
              <v-container v-else>
                <v-row>
                  <v-col cols="2"></v-col>
                  <v-col cols="8">
                    <v-simple-table>
                      <template #default>
                        <thead>
                          <tr>
                            <th class="text-left">Date</th>
                            <th class="text-right">Montant</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in versements" :key="item.id">
                            <td class="text-left">
                              {{ $moment(item.created_at).format('llll') }}
                            </td>
                            <td class="text-right">{{ item.montant }} FCFA</td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td class="text-left"><b>Total versé</b></td>
                            <td class="text-right">
                              <b>{{ totalVerse }} FCFA</b>
                            </td>
                          </tr>
                        </tfoot>
                      </template>
                    </v-simple-table>
                  </v-col>
                  <v-col cols="2"></v-col>
                </v-row>
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
    versements: [],
    attribuable: false,
  }),
  computed: {
    getStatusColor() {
      if (this.status === 'impayée') {
        return 'red--text'
      } else if (this.status === 'en cours') {
        return 'blue--text'
      } else {
        return 'green--text'
      }
    },
    montant() {
      if (this.details) {
        return (
          this.details.prix *
          this.$moment(this.details.sortie).diff(this.details.entree, 'days')
        )
      } else {
        return 0
      }
    },
    totalVerse() {
      let total = 0
      this.versements.forEach((versement) => {
        total += versement.montant
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
  beforeUpdate() {
    if (this.details.encaissement) {
      this.versements = this.details.encaissement.versements
    } else {
      this.versements = []
    }
    const now = this.$moment()
    this.attribuable = this.$moment(this.details.entree).isSame(now, 'days')
    // console.log(this.details)
  },
  methods: {
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
