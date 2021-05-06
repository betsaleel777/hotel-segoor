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
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline primary--text">créer un produit</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <!-- image -->
              <v-col cols="6">
                <v-text-field
                  v-model="produit.nom"
                  :errors="errors.nom.exist"
                  :error-messages="errors.nom.message"
                  dense
                  outlined
                  label="libelle"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="produit.seuil"
                  :errors="errors.seuil.exist"
                  :error-messages="errors.seuil.message"
                  dense
                  outlined
                  type="number"
                  label="Seuil"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-radio-group
                  v-model="produit.mode"
                  :error="errors.mode.exist"
                  :error-messages="errors.mode.message"
                  row
                >
                  <v-radio
                    label="Unité"
                    color="primary"
                    value="unité"
                  ></v-radio>
                  <v-radio
                    label="Poids"
                    color="primary"
                    value="poids"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="7">
                <v-radio-group
                  v-model="produit.type"
                  :error="errors.type.exist"
                  :error-messages="errors.type.message"
                  row
                >
                  <v-radio
                    label="standard"
                    color="primary"
                    value="standard"
                  ></v-radio>
                  <v-radio
                    label="Assaisonement"
                    color="primary"
                    value="assaisonement"
                  ></v-radio>
                </v-radio-group>
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
  // components: { CreateCategorieForm },
  data: () => {
    const defaultForm = Object.freeze({
      mode: null,
      type: null,
      image: null,
      seuil: null,
      nom: null,
    })
    return {
      dialog: false,
      produit: Object.assign({}, defaultForm),
      errors: {
        mode: { exist: false, message: null },
        type: { exist: false, message: null },
        image: { exist: false, message: null },
        seuil: { exist: false, message: null },
        nom: { exist: false, message: null },
      },
    }
  },
  methods: {
    reinitialise() {
      this.$refs.form.reset()
      errorsInitialise(this.errors)
      this.dialog = false
    },
    save() {
      this.$axios
        .post('api/restaurant/produits/new', { ...this.produit })
        .then((result) => {
          const { message, produit } = result.data
          this.$notifier.show({ text: message, variant: 'success' })
          this.reinitialise()
          this.$emit('new-produit', produit)
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
