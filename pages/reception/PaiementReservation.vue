<template>
  <v-dialog v-model="dialog" max-width="650px">
    <template #activator="{ on }">
      <v-btn color="blue darken-4" text v-on="on"
        >Enregistrer un versement
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="justify-center primary--text headline"
        ><div>
          Création de versement pour la réservation {{ reservation.code }}
        </div>
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
        <v-btn color="blue darken-4" text @click="close">Fermer</v-btn>
        <v-btn color="blue darken-4" text @click="saveVersement"
          >Enregistrer</v-btn
        >
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
  methods: {
    saveVersement() {
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
          })
          .then((result) => {
            const { message, encaissement } = result.data
            this.$notifier.show({ text: message, variant: 'success' })
            this.close()
            this.$emit('new-versement', encaissement)
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
