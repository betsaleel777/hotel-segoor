<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        color="primary"
        dark
        absolute
        bottom
        right
        fab
        v-on="on"
      >
        <v-icon>mdi-plus-circle</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline primary--text">Encaissement {{ item.code }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12"> </v-col>
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
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => {
    const defaultForm = Object.freeze({
      montant: null,
    })
    return {
      dialog: false,
      versement: Object.assign({}, defaultForm),
      hint: '',
      errors: {
        montant: { exist: false, message: null },
      },
    }
  },
  methods: {
    reinitialise() {
      this.$refs.form.reset()
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
  },
}
</script>

<style></style>
