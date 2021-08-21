<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn
        v-if="floating"
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
      <v-btn v-else v-bind="attrs" dark color="primary" v-on="on">
        <v-icon left>mdi-plus-thick</v-icon>
        AJOUTER
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Approvisionner le stock</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-autocomplete
                  v-model="produit"
                  :errors="errors.ingredient.exist"
                  :error-messages="errors.ingredient.message"
                  :items="produits"
                  item-value="id"
                  item-text="nom"
                  return-object
                  dense
                  outlined
                  label="Article"
                  required
                >
                  <template #label>
                    Article
                    <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="achat.quantite"
                  :errors="errors.quantite.exist"
                  :error-messages="errors.quantite.message"
                  :suffix="suffixQuantite"
                  dense
                  type="number"
                  outlined
                  label="Quantité"
                  required
                >
                  <template #label>
                    Quantité
                    <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="achat.prix_achat"
                  :errors="errors.prix_achat.exist"
                  :error-messages="errors.prix_achat.message"
                  suffix="FCFA"
                  type="number"
                  dense
                  outlined
                  label="Prix de revient"
                  required
                >
                  <template #label>
                    Prix de revient
                    <span class="red--text"><strong>* </strong></span>
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
/* eslint-disable no-unused-vars */
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
    floating: {
      type: Boolean,
      default: true,
    },
  },
  data: () => {
    const defaultForm = Object.freeze({
      ingredient: null,
      quantite: null,
      prix_achat: null,
      prix_vente: 0,
    })
    return {
      dialog: false,
      achat: Object.assign({}, defaultForm),
      produit: { mesure: '' },
      errors: {
        ingredient: { exist: false, message: null },
        quantite: { exist: false, message: null },
        prix_achat: { exist: false, message: null },
        prix_vente: { exist: false, message: null },
      },
    }
  },
  computed: {
    suffixQuantite() {
      if (this.produit.mesure) {
        return this.produit.mesure
      } else return "l'unité"
    },
  },
  methods: {
    reinitialise() {
      this.$refs.form.reset()
      this.produit = { mesure: '' }
      errorsInitialise(this.errors)
      this.dialog = false
    },
    save() {
      this.achat.ingredient = this.produit.id
      this.$axios
        .post('stock/achats/new', { ...this.achat })
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
