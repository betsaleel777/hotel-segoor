<template>
  <v-dialog v-model="dialog" persistent max-width="450px">
    <template #activator="{ on, attrs }">
      <v-btn
        dark
        color="primary"
        elevation="4"
        fab
        small
        v-bind="attrs"
        v-on="on"
        ><v-icon dark>mdi-plus</v-icon></v-btn
      >
    </template>
    <v-card>
      <v-card-title>
        <span class="headline primary--text">Créer categorie</span>
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
                  label="Nom"
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
    ...mapActions('parametre/categorie-chambre', ['ajouter']),
    reinitialise() {
      this.dialog = false
      errorsInitialise(this.errors)
      this.$refs.form.reset()
    },

    save() {
      this.ajouter({
        nom: this.nom,
      })
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
