<template>
  <v-dialog v-model="dialog" max-width="650px">
    <template #activator="{ on }">
      <v-btn :disabled="total >= montantApayer" color="primary" text v-on="on"
        >Paiement
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="justify-center primary--text headline grey lighten-2"
        ><div>
          Paiement pour l'hébergement chambre {{ reception.chambre_linked.nom }}
        </div>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text justify="center" align="center">
        <v-form ref="form" v-model="valid">
          <v-container>
            <h4 class="pink--text mb-5">
              le montant qui reste à payer est: {{ reste }} FCFA
            </h4>
            <v-row>
              <v-col cols="3">
                <v-select
                  v-model="versement.mobile_money"
                  :disabled="activateWay.mobile"
                  dense
                  :items="mobileWays"
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
                  required
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
                  required
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
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="close">Fermer</v-btn>
        <v-btn
          :disabled="!encaissable"
          color="success"
          text
          @click="createVersement"
          >Enregistrer</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
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
    total: {
      type: Number,
      required: true,
    },
    consommation: {
      type: Number,
      required: true,
    },
  },
  data: () => {
    return {
      dialog: false,
      encaissable: true,
      valid: false,
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
      versements: [],
      mobileWays: [],
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
    nuiteeAvecRemise() {
      return this.reception.prix * (1 - this.reception.remise / 100)
    },
    montantApayer() {
      if (this.reception) {
        return this.nuiteeAvecRemise * this.quantiteNuitee
      } else {
        return null
      }
    },
    quantiteNuitee() {
      return this.$moment(this.reception.sortie).diff(
        this.reception.entree,
        'days'
      )
    },
    remise() {
      return (
        ((this.reception.prix * this.reception.remise) / 100) *
        this.quantiteNuitee
      )
    },
    dejaVerse() {
      return (
        this.total +
        (Number(this.versement.montant) - Number(this.versement.monnaie))
      )
    },
    reste() {
      return this.montantApayer - Number(this.total) + this.consommation
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
  mounted() {
    this.$axios.get('caisses/mobilesMoney').then((result) => {
      this.mobileWays = result.data.mobiles
    })
  },
  methods: {
    createVersement() {
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
        this.$axios
          .post('reception/encaissements/new', {
            mode: 'reception',
            montant: this.versement.montant,
            attribution: this.reception.id,
            dejaVerse: this.dejaVerse,
            montantApayer: this.montantApayer + this.consommation,
            monnaie: this.versement.monnaie,
            mobile_money: this.versement.mobile_money,
            espece: this.versement.espece,
            cheque: this.versement.cheque,
            user: this.user.id,
          })
          .then((result) => {
            const { message, versement, status } = result.data
            this.$notifier.show({ text: message, variant: 'success' })
            this.close()
            status === 'soldée'
              ? this.$emit('paid', versement)
              : this.$emit('new-versement', versement)
          })
          .catch((err) => {
            const { data } = err.response
            errorsInitialise(this.errors)
            errorsWriting(data, this.errors)
          })
      }
    },
    close() {
      this.dialog = false
      this.$refs.form.reset()
      this.versement.monnaie = 0
      this.versement.montant = 0
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
