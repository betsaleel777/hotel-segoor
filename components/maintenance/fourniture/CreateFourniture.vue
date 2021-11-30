<template>
  <v-dialog v-model="dialog" persistent max-width="560px">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" dark small color="primary" v-on="on">
        <v-icon left>mdi-plus-thick</v-icon>
        AJOUTER
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Créer Equipement</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-text-field
              v-model="fourniture.nom"
              :errors="errors.nom.exist"
              :error-messages="errors.nom.message"
              dense
              outlined
            >
              <template #label>
                Nom<span class="red--text"><strong> *</strong></span>
              </template>
            </v-text-field>
            <v-textarea
              v-model="fourniture.description"
              dense
              outlined
              label="Description"
            >
            </v-textarea>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="reinitialise"> Fermer </v-btn>
        <v-btn color="primary" text @click="save"> Créer </v-btn>
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

export default {
  data: () => {
    return {
      dialog: false,
      fourniture: {
        description: null,
        nom: null,
      },
      errors: {
        nom: { exist: false, message: null },
      },
    }
  },
  methods: {
    ...mapActions('maintenance/fourniture', ['ajouter']),
    reinitialise() {
      this.$refs.form.reset()
      errorsInitialise(this.errors)
      this.dialog = false
    },
    save() {
      this.ajouter(this.fourniture)
        .then((result) => {
          this.$notifier.show({ text: result.message, variant: 'success' })
          this.reinitialise()
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
