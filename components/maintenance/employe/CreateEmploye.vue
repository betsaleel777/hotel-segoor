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
        <span class="headline primary--text">Créer emloyé</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-5">
        <v-form ref="form">
          <v-container>
            <v-text-field
              v-model="employe.nom"
              :errors="errors.nom.exist"
              :error-messages="errors.nom.message"
              dense
              outlined
            >
              <template #label>
                Nom<span class="red--text"><strong> *</strong></span>
              </template>
            </v-text-field>
            <v-text-field
              v-model="employe.prenom"
              :errors="errors.prenom.exist"
              :error-messages="errors.prenom.message"
              dense
              outlined
              required
            >
              <template #label>
                Prénoms<span class="red--text"><strong> *</strong></span>
              </template>
            </v-text-field>
            <v-text-field
              v-model="employe.poste"
              :errors="errors.poste.exist"
              :error-messages="errors.poste.message"
              dense
              outlined
              required
            >
              <template #label>
                Poste<span class="red--text"><strong> *</strong></span>
              </template>
            </v-text-field>
            <v-text-field
              v-model="employe.adresse"
              :errors="errors.adresse.exist"
              :error-messages="errors.adresse.message"
              dense
              outlined
              required
            >
              <template #label>
                Adresse<span class="red--text"><strong> *</strong></span>
              </template>
            </v-text-field>
            <v-text-field
              v-model="employe.telephone"
              :errors="errors.telephone.exist"
              :error-messages="errors.telephone.message"
              dense
              outlined
              required
            >
              <template #label>
                Téléphone<span class="red--text"><strong> *</strong></span>
              </template>
            </v-text-field>
            <v-text-field v-model="employe.email" dense outlined label="Email">
            </v-text-field>
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
      employe: {
        prenom: null,
        nom: null,
        poste: null,
        adresse: null,
        telephone: null,
        email: null,
      },
      errors: {
        prenom: { exist: false, message: null },
        nom: { exist: false, message: null },
        poste: { exist: false, message: null },
        adresse: { exist: false, message: null },
        telephone: { exist: false, message: null },
      },
    }
  },
  methods: {
    ...mapActions('maintenance/employe', ['ajouter']),
    reinitialise() {
      this.$refs.form.reset()
      errorsInitialise(this.errors)
      this.dialog = false
    },
    save() {
      this.ajouter(this.employe)
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
