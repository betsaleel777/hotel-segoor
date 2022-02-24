<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn
        v-if="floating"
        v-bind="attrs"
        color="primary"
        dark
        absolute
        bottom
        right
        fab
        v-on="on"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn v-else v-bind="attrs" dark color="primary" v-on="on">
        <v-icon left>mdi-plus-thick</v-icon>
        AJOUTER
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline primary--text">Enregistrer un versement</span>
      </v-card-title>
      <v-card-text class="mt-5">
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-radio-group v-model="mode" dense row>
                  <v-radio
                    label="Pour réservation"
                    value="reserve"
                    @change="radioChange"
                  ></v-radio>
                  <v-spacer></v-spacer>
                  <v-radio
                    label="Pour séjour"
                    value="attribuate"
                    @change="radioChange"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col v-if="attributed" cols="12">
                <v-autocomplete
                  v-model="versement.attribution"
                  :errors="errors.attribution.exist"
                  :error-messages="errors.attribution.message"
                  :items="attributions"
                  item-value="id"
                  item-text="nom"
                  return-object
                  dense
                  outlined
                  label="Clients en chambre"
                  required
                  @change="selectAttribution"
                ></v-autocomplete>
              </v-col>
              <v-col v-if="reserved" cols="12">
                <v-autocomplete
                  v-model="versement.reservation"
                  :errors="errors.reservation.exist"
                  :error-messages="errors.reservation.message"
                  :items="reservations"
                  item-value="id"
                  item-text="nom"
                  return-object
                  dense
                  outlined
                  label="Réservations"
                  required
                  @change="selectReservation"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="versement.montant"
                  :errors="errors.montant.exist"
                  :error-messages="errors.montant.message"
                  dense
                  outlined
                  min="0"
                  type="number"
                  label="Montant"
                  required
                  :hint="hint"
                  suffix="FCFA"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="reinitialise"> Fermer </v-btn>
        <v-btn color="blue darken-1" text @click="save"> Créer </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'

export default {
  props: {
    attributions: {
      type: Array,
      required: true,
    },
    reservations: {
      type: Array,
      required: true,
    },
    floating: {
      type: Boolean,
      default: true,
    },
  },
  data: () => {
    const defaultForm = Object.freeze({
      attribution: null,
      reservation: null,
      montant: null,
    })
    return {
      dialog: false,
      versement: Object.assign({}, defaultForm),
      reserved: true,
      attributed: false,
      mode: 'reserve',
      hint: '',
      prixAvecRemise: null,
      errors: {
        attribution: { exist: false, message: null },
        reservation: { exist: false, message: null },
        montant: { exist: false, message: null },
      },
    }
  },
  computed: {
    activeSave() {
      return (
        Boolean(this.versement.attribution) &&
        Boolean(this.versement.reservation)
      )
    },
  },
  methods: {
    reinitialise() {
      const defaultForm = Object.freeze({
        attribution: null,
        reservation: null,
        montant: null,
      })
      this.mode = 'reserve'
      this.reserved = true
      this.attributed = false
      this.hint = ''
      this.prixAvecRemise = null
      this.versement = Object.assign({}, defaultForm)
      errorsInitialise(this.errors)
      this.dialog = false
    },
    save() {
      this.$axios
        .post('reception/encaissements/new', {
          attribution: this.versement.attribution
            ? this.versement.attribution.id
            : null,
          reservation: this.versement.reservation
            ? this.versement.reservation.id
            : null,
          montant: this.versement.montant,
          mode: this.mode,
          user: this.user.id,
        })
        .then((result) => {
          const { message, encaissement } = result.data
          this.$notifier.show({ text: message, variant: 'success' })
          this.reinitialise()
          this.$emit('new-encaissement', encaissement)
        })
        .catch((err) => {
          const { data } = err.response
          if (data) {
            errorsInitialise(this.errors)
            errorsWriting(data, this.errors)
          }
        })
    },
    radioChange() {
      this.reserved = !this.reserved
      this.attributed = !this.reserved
    },
    selectReservation() {
      this.hint = `La chambre coûte ${this.versement.reservation.prix}`
    },
    selectAttribution() {
      this.prixAvecRemise = this.versement.attribution.prix
      if (parseInt(this.versement.attribution.remise) !== 0) {
        this.prixAvecRemise =
          this.versement.attribution.prix -
          (this.versement.attribution.prix *
            this.versement.attribution.remise) /
            100
        this.hint = `La chambre coûte ${this.versement.attribution.prix}
        avec une remise de ${
          this.versement.attribution.remise
        }%, le client doit payer: ${this.prixAvecRemise.toFixed(2)}`
      } else {
        this.hint = `La chambre coûte ${this.versement.attribution.prix}`
      }
    },
  },
}
</script>

<style></style>
