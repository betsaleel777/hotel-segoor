<template>
  <v-dialog v-model="dialog" persistent max-width="800">
    <v-card v-if="Object.keys(details).length > 0">
      <v-card-title>
        <div class="headline primary--text">
          Détails de l'hébergement {{ details.code }}
        </div>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <div class="text-left">
                <h2 :class="getStatusColor">{{ details.status }}</h2>
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
                  <h4>
                    Nuitée: {{ details.prix * (1 - details.remise / 100) }}
                  </h4>
                  <h4>
                    Du:
                    {{ $moment(details.entree).format('ll') }} au
                    {{ $moment(details.sortie).format('ll') }}
                  </h4>
                  <h4>Montant: {{ montant }}</h4>
                </span>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-center">
                <h2 class="primary--text">Consommation du Client</h2>
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
                <h2 class="pink--text darken-3">
                  Montant total à payer:
                  {{ total + montant }}
                </h2>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click.stop="dialog = false"
          >Fermer</v-btn
        >
        <paiement-reception :item="details" @paid="onPaid" />
        <print-facture :encaissement="details" />
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
  props: {
    details: {
      type: Object,
      default: () => {
        return {}
      },
    },
    value: Boolean,
  },
  data() {
    return {
      consommations: [],
    }
  },
  computed: {
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
    montant() {
      if (this.details) {
        return (
          this.details.prix *
          (1 - this.details.remise / 100) *
          this.$moment(this.details.sortie).diff(this.details.entree, 'days')
        )
      } else {
        return null
      }
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
    organiser() {
      const compare = (a, b) => {
        if (this.$moment(a.jour).diff(b.jour) < 0) {
          return -1
        }
        if (this.$moment(a.jour).diff(b.jour) < 0) {
          return 1
        }
        return 0
      }
      const { cocktails, plats, produits, tournees } = this.details.consommation
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
    onPaid(encaissement) {},
  },
}
</script>

<style></style>
