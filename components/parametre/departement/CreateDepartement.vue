<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-if="floatingButton" #activator="{ on, attrs }">
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
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <template v-else #activator="{ on, attrs }">
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
        <span class="headline primary--text">Créer département</span>
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
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="description"
                  outlined
                  dense
                  label="Description"
                ></v-textarea>
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
  errorsWriting,
  errorsInitialise,
} from '~/components/helper/errorsHandle'
export default {
  props: {
    floatingButton: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    dialog: false,
    nom: null,
    errors: { nom: { exist: false, message: null } },
  }),
  methods: {
    reinitialise() {
      this.dialog = false
      errorsInitialise(this.errors)
      this.$refs.form.reset()
    },
    save() {
      this.$axios
        .post('parametre/departements/new', {
          nom: this.nom,
          user: this.user.id,
          description: this.description,
        })
        .then((result) => {
          const { message, departement } = result.data
          this.$notifier.show({ text: message, variant: 'success' })
          this.$emit('new-departement', departement)
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
