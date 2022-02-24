<template>
  <v-dialog v-model="dialogue" persistent max-width="600px">
    <template #activator="{ on: dialog, attrs }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            v-bind="attrs"
            color="primary"
            elevation="1"
            icon
            fab
            dark
            x-small
            v-on="{ ...tooltip, ...dialog }"
          >
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <span>modifier</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Modifier cocktail</span>
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
            <article-edit-form
              :key="update"
              :ingredients="ingredients"
              @update-list="listeUpdate"
            />
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="reinitialise"> Fermer </v-btn>
        <v-btn color="primary" text @click="save"> Modifier </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import ArticleEditForm from './ArticleEditForm.vue'
import {
  errorsInitialise,
  // eslint-disable-next-line no-unused-vars
  errorsWriting,
} from '~/components/helper/errorsHandle'

export default {
  components: { ArticleEditForm },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => {
    return {
      dialogue: false,
      ingredients: [],
      update: false,
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
  mounted() {
    this.initialisation()
    this.cocktail = Object.assign({}, this.item)
  },
  methods: {
    ...mapActions('cocktail', ['modifier']),
    reinitialise() {
      this.initialisation()
      this.cocktail = Object.assign({}, this.item)
      errorsInitialise(this.errors)
      this.dialogue = false
    },
    initialisation() {
      this.ingredients = this.item.tournees.map((tournee) => {
        return {
          quantite: tournee.pivot.quantite,
          id: tournee.pivot.tournee,
          titre: tournee.titre,
        }
      })
      this.update = !this.update
    },
    save() {
      this.modifier({
        id: this.item.id,
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
      this.ingredients.push(...element)
    },
  },
}
</script>

<style></style>
