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
        <span class="headline primary--text">Créer un cocktail</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-5">
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="cocktail.nom"
                  :errors="errors.nom.exist"
                  :error-messages="errors.nom.message"
                  dense
                  outlined
                  label="Désignation"
                  required
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="cocktail.montant"
                  :errors="errors.montant.exist"
                  :error-messages="errors.montant.message"
                  dense
                  outlined
                  label="Montant"
                  placeholder="prix de vente du cocktail"
                  type="number"
                  min="0"
                  required
                >
                  <template #label>
                    prix de vente du cocktail<span class="red--text"
                      ><strong> *</strong></span
                    >
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="cocktail.description"
                  dense
                  outlined
                  label="Commentaires"
                  required
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <h6 class="text-center">Composants du coktail</h6>
              </v-col>
            </v-row>
            <article-form-cocktail @update-list="listeUpdate" />
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
import ArticleFormCocktail from './ArticleFormCocktail.vue'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'

export default {
  components: { ArticleFormCocktail },
  props: {
    floating: {
      type: Boolean,
      default: true,
    },
  },
  data: () => {
    return {
      dialog: false,
      ingredients: [],
      cocktail: {
        nom: null,
        montant: null,
        description: null,
      },
      errors: {
        nom: { exist: false, message: null },
        montant: { exist: false, message: null },
      },
    }
  },
  methods: {
    ...mapActions('cocktail', ['ajouter']),
    reinitialise() {
      this.$refs.form.reset()
      errorsInitialise(this.errors)
      this.ingredients = []
      this.dialog = false
    },
    save() {
      this.ajouter({
        ...this.cocktail,
        ingredients: this.ingredients,
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
    listeUpdate(element) {
      this.ingredients = element
    },
  },
}
</script>

<style></style>
