<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" dark color="primary" v-on="on">
        <v-icon left>mdi-plus-thick</v-icon>
        AJOUTER
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">créer paiement mobile</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="nom"
                  :error="errors.nom.exist"
                  :error-messages="errors.nom.message"
                  dense
                  outlined
                  required
                >
                  <template #label>
                    Nom
                    <span class="red--text"><strong> *</strong></span>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
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
  errorsWriting,
  errorsInitialise,
} from '~/components/helper/errorsHandle'
export default {
  data: () => ({
    dialog: false,
    nom: null,
    errors: { nom: { exist: false, message: null } },
  }),
  methods: {
    ...mapActions('moyen', ['ajouter']),
    reinitialise() {
      this.dialog = false
      errorsInitialise(this.errors)
      this.$refs.form.reset()
    },
    save() {
      this.ajouter({ nom: this.nom })
        .then((result) => {
          this.$notifier.show({
            text: result.message,
            variant: 'success',
          })
          this.reinitialise()
        })
        .catch((err) => {
          if (err.response.data) {
            errorsInitialise(this.errors)
            errorsWriting(err.response.data, this.errors)
          }
        })
    },
  },
}
</script>

<style></style>
