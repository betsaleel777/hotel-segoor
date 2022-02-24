<template>
  <v-dialog v-model="dialogue" max-width="650px">
    <template #activator="{ on: dialog, attrs }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            v-bind="attrs"
            color="success"
            elevation="1"
            icon
            fab
            dark
            x-small
            v-on="{ ...tooltip, ...dialog }"
          >
            <v-icon small>mdi-cash</v-icon>
          </v-btn>
        </template>
        <span>paiement</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="justify-center primary--text headline grey lighten-2"
        ><div>Paiement pour le client {{ reception.client_linked.nom }}</div>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text justify="center" align="center">
        <v-form ref="form">
          <v-container>
            <h6 class="pink--text mb-5">
              le montant qui reste à payer est: {{ reste }} FCFA
            </h6>
            <v-row>
              <v-col cols="3">
                <v-select
                  v-model="versement.mobile_money"
                  :disabled="activateWay.mobile"
                  dense
                  :items="moyens"
                  item-text="nom"
                  item-value="id"
                  label="Mobile money"
                  clearable
                  @change="setWay('mobile')"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="versement.cheque"
                  :disabled="activateWay.cheque"
                  dense
                  label="Numéro du cheque"
                  @change="setWay('cheque')"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-checkbox
                  v-model="versement.espece"
                  :disabled="activateWay.espece"
                  label="Espèce"
                  dense
                  @change="setWay('espece')"
                ></v-checkbox>
              </v-col>
              <v-divider></v-divider>
              <v-col cols="6">
                <v-text-field
                  v-model="versement.montant"
                  :errors="errors.montant.exist"
                  :error-messages="errors.montant.message"
                  dense
                  outlined
                  label="Montant perçu"
                  type="number"
                  min="0"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="versement.monnaie"
                  :errors="errors.monnaie.exist"
                  :error-messages="errors.monnaie.message"
                  dense
                  outlined
                  label="Monnaie rendue"
                  type="number"
                  min="0"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="close">Fermer</v-btn>
        <v-btn :disabled="!encaissable" color="success" text @click="save"
          >Enregistrer</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'
const checkEncaissable = function (montant, monnaie, reste) {
  return (
    Number(montant) > Number(monnaie) &&
    Number(montant) - Number(monnaie) <= Number(reste)
  )
}
export default {
  props: {
    reception: {
      type: Object,
      required: true,
    },
    moyens: {
      type: Array,
      required: true,
    },
  },
  data: () => {
    return {
      dialogue: false,
      encaissable: true,
      versement: {
        montant: 0,
        monnaie: 0,
        cheque: null,
        espece: null,
        mobile_money: null,
      },
      errors: {
        montant: { exist: false, message: null },
        monnaie: { exist: false, message: null },
      },
      activateWay: {
        cheque: false,
        espece: false,
        mobile: false,
      },
      waysPayementRules: [(v) => !!v || 'le moyen de paiement est requis'],
      montantRules: [(v) => !!v || 'le montant perçu est requis'],
    }
  },
  computed: {
    versements() {
      let result = null
      if (this.reception.encaissement) {
        result = this.reception.encaissement.versements
      } else {
        result = []
      }
      return result
    },
    nuiteeAvecRemise() {
      return Math.round(this.reception.prix * (1 - this.reception.remise / 100))
    },
    quantiteNuitee() {
      return this.$moment(this.reception.sortie).diff(
        this.reception.entree,
        'days'
      )
    },
    remise() {
      return Math.round(
        ((this.reception.prix * this.reception.remise) / 100) *
          this.quantiteNuitee
      )
    },
    dejaVerse() {
      return (
        this.reception.verse +
        (Number(this.versement.montant) - Number(this.versement.monnaie))
      )
    },
    reste() {
      return (
        this.reception.montant -
        Number(this.reception.verse) +
        this.reception.consommation
      )
    },
  },
  watch: {
    'versement.montant'(montant) {
      this.encaissable = checkEncaissable(
        montant,
        this.versement.monnaie,
        this.reste
      )
    },
    'versement.monnaie'(monnaie) {
      this.encaissable = checkEncaissable(
        this.versement.montant,
        monnaie,
        this.reste
      )
    },
  },
  methods: {
    ...mapActions('facture-reception', ['encaisser']),
    save() {
      const payementChoice =
        Boolean(this.versement.mobile_money) ||
        Boolean(this.versement.espece) ||
        Boolean(this.versement.monnaie)
      if (!this.$refs.form.validate() && payementChoice) {
        this.$notifier.show({
          text: 'Certaines valeurs soumises sont incorrectes',
          variant: 'error',
        })
      } else {
        this.encaisser({
          mode: 'reception',
          montant: this.versement.montant,
          attribution: this.reception.id,
          dejaVerse: this.dejaVerse,
          montantApayer: this.reception.montant + this.reception.consommation,
          monnaie: this.versement.monnaie,
          mobile_money: this.versement.mobile_money,
          espece: this.versement.espece,
        })
          .then((result) => {
            this.$notifier.show({
              text: result.message,
              variant: 'success',
            })
            this.$emit('add-payed')
            this.close()
          })
          .catch((err) => {
            const { data } = err.response
            errorsInitialise(this.errors)
            errorsWriting(data, this.errors)
          })
      }
    },
    close() {
      this.dialogue = false
      this.$refs.form.reset()
      this.versement.monnaie = 0
      this.versement.montant = 0
      this.encaissable = true
      this.activateWay = { cheque: false, espece: false, mobile: false }
      errorsInitialise(this.errors)
    },
    setWay(origine) {
      if (origine === 'cheque') {
        this.activateWay.espece = !this.activateWay.espece
        this.activateWay.mobile = !this.activateWay.mobile
      } else if (origine === 'espece') {
        this.activateWay.cheque = !this.activateWay.cheque
        this.activateWay.mobile = !this.activateWay.mobile
      } else {
        this.activateWay.cheque = !this.activateWay.cheque
        this.activateWay.espece = !this.activateWay.espece
      }
    },
  },
}
</script>

<style></style>
