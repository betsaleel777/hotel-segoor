<template>
  <v-dialog v-model="dialog" max-width="650px">
    <template #activator="{ on }">
      <v-btn :disabled="total >= montantApayer" color="primary" text v-on="on"
        >Paiement
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="justify-center primary--text headline grey lighten-2"
        ><div>Paiement pour la réservation {{ reservation.code }}</div>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text justify="center" align="center">
        <v-text-field
          v-model="versement.montant"
          :errors="errors.montant.exist"
          :error-messages="errors.montant.message"
          dense
          outlined
          label="Montant"
          type="number"
          min="0"
          required
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="close">Fermer</v-btn>
        <v-btn color="success" text @click="createVersement">Enregistrer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    reservation: {
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
      versement: {
        montant: null,
      },
      errors: {
        montant: { exist: false, message: null },
      },
      versements: [],
    }
  },
  computed: {
    montantApayer() {
      if (this.reservation) {
        return (
          this.reservation.prix *
          this.$moment(this.reservation.sortie).diff(
            this.reservation.entree,
            'days'
          )
        )
      } else {
        return null
      }
    },
  },
  methods: {
    createVersement() {
      if (Number(this.versement.montant) === 0) {
        this.$notifier.show({
          text: 'La valeur de montant est incorrecte',
          variant: 'error',
        })
      } else {
        this.$axios
          .post('reception/encaissements/new', {
            mode: 'reserve',
            montant: this.versement.montant,
            reservation: this.reservation.id,
            dejaVerse: this.total,
            montantApayer: this.montantApayer,
          })
          .then((result) => {
            const { message, versement, status } = result.data
            this.$notifier.show({ text: message, variant: 'success' })
            this.close()
            this.versement.montant = null
            status === 'soldée'
              ? this.$emit('paid', versement)
              : this.$emit('new-versement', versement)
          })
      }
    },
    close() {
      this.dialog = false
    },
  },
}
</script>

<style></style>
