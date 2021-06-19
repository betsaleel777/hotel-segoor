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
      <v-card-title>
        <span class="headline primary--text">Créer un cocktail</span>
      </v-card-title>
      <v-card-text>
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
                  label="Designation"
                  required
                ></v-text-field>
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
                  required
                ></v-text-field>
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
                <h3 class="text-center">Composants du coktail</h3>
              </v-col>
            </v-row>
            <article-form-cocktail />
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
import { mapGetters, mapActions } from 'vuex'
import ArticleFormCocktail from './ArticleFormCocktail.vue'
import {
  errorsInitialise,
  // eslint-disable-next-line no-unused-vars
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
    const defaultForm = Object.freeze({
      nom: null,
      montant: null,
      description: null,
    })
    return {
      dialog: false,
      cocktail: Object.assign({}, defaultForm),
      errors: {
        nom: { exist: false, message: null },
        montant: { exist: false, message: null },
      },
    }
  },
  computed: {
    ...mapGetters('cocktail', ['liste']),
  },
  methods: {
    ...mapActions('cocktail', ['viderList']),
    reinitialise() {
      this.$refs.form.reset()
      this.viderList()
      errorsInitialise(this.errors)
      this.dialog = false
    },
    save() {
      this.$axios
        .post('bar/cocktails/new', {
          ...this.cocktail,
          ingredients: this.liste,
        })
        .then((result) => {
          const { message, cocktail } = result.data
          this.$notifier.show({ text: message, variant: 'success' })
          this.reinitialise()
          this.$emit('new-cocktail', cocktail)
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
