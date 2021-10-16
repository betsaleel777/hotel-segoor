<template>
  <v-dialog v-model="dialogue" max-width="650px">
    <template #activator="{ on: dialog }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            elevation="1"
            icon
            fab
            dark
            x-small
            color="success"
            v-on="{ ...tooltip, ...dialog }"
            @click="getItem"
          >
            <v-icon small> mdi-cash </v-icon>
          </v-btn>
        </template>
        <span>paiement</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="justify-center primary--text headline grey lighten-2"
        ><div>Paiement pour la facture {{ encaissement.code }}</div>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text justify="center" align="center">
        <v-form ref="form">
          <v-container>
            <h4 class="pink--text mb-5">
              Le montant qui reste à payer est:
              {{ reste | formater }}
            </h4>
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
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  props: {
    item: {
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
      encaissement: null,
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
      mobileWays: [],
      activateWay: {
        cheque: false,
        espece: false,
        mobile: false,
      },
    }
  },
  computed: {
    dejaVerse() {
      return (
        Number(this.encaissement.verse) +
        (Number(this.versement.montant) - Number(this.versement.monnaie))
      )
    },
    reste() {
      return this.encaissement.montant - this.encaissement.verse
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
  created() {
    this.encaissement = this.item
  },
  methods: {
    ...mapActions({
      encaisser: 'caisse/encaissement/encaisser',
      getItemElement: 'caisse/encaissement/getItemElement',
    }),
    save() {
      const payementValidation =
        Boolean(this.versement.mobile_money) ||
        Boolean(this.versement.espece) ||
        Boolean(this.versement.cheque)
      if (!payementValidation) {
        this.$notifier.show({
          text: 'Certaines valeurs soumises sont incorrectes',
          variant: 'error',
        })
      } else {
        this.encaisser({
          departement: 2,
          encaissement: this.encaissement.id,
          montant: this.versement.montant,
          dejaVerse: this.dejaVerse,
          montantApayer: this.encaissement.montant,
          monnaie: this.versement.monnaie,
          mobile_money: this.versement.mobile_money,
          espece: this.versement.espece,
          cheque: this.versement.cheque,
        })
          .then((result) => {
            this.$notifier.show({
              text: result.message,
              variant: 'success',
            })
            this.close()
            result.status === 'soldée'
              ? this.$emit('paid', result.versement)
              : this.$emit('new-versement', result.versement)
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
    getItem() {
      this.getItemElement(this.item.id).then((item) => {
        this.encaissement = item
      })
    },
  },
}
</script>

<style></style>
