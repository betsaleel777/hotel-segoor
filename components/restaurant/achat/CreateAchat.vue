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
        <span class="headline primary--text"
          >Approvisionner le stock cuisine</span
        >
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-autocomplete
                  v-model="achat.ingredient"
                  :errors="errors.ingredient.exist"
                  :error-messages="errors.ingredient.message"
                  :items="produits"
                  item-value="id"
                  item-text="nom"
                  dense
                  outlined
                  label="Ingredient"
                  required
                ></v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="achat.quantite"
                  :errors="errors.quantite.exist"
                  :error-messages="errors.quantite.message"
                  dense
                  type="number"
                  outlined
                  label="Quantité"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="achat.prix_achat"
                  :errors="errors.prix_achat.exist"
                  :error-messages="errors.prix_achat.message"
                  suffix="FCFA"
                  type="number"
                  dense
                  outlined
                  label="Prix d'achat"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="achat.prix_vente"
                  :errors="errors.prix_vente.exist"
                  :error-messages="errors.prix_vente.message"
                  suffix="FCFA"
                  type="number"
                  dense
                  outlined
                  label="Prix de vente"
                  required
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
    produits: {
      type: Array,
      required: true,
    },
  },
  data: () => {
    const defaultForm = Object.freeze({
      ingredient: null,
      quantite: null,
      prix_achat: null,
      prix_vente: null,
    })
    return {
      dialog: false,
      achat: Object.assign({}, defaultForm),
      errors: {
        ingredient: { exist: false, message: null },
        quantite: { exist: false, message: null },
        prix_achat: { exist: false, message: null },
        prix_vente: { exist: false, message: null },
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
        .post('restaurant/achats/new', { ...this.achat })
        .then((result) => {
          const { message, achat } = result.data
          this.$notifier.show({ text: message, variant: 'success' })
          this.reinitialise()
          this.$emit('new-achat', achat)
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
