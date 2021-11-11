<template>
  <v-dialog v-model="dialogue" persistent max-width="600px">
    <template #activator="{ on: dialog, attrs }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            elevation="1"
            icon
            fab
            dark
            x-small
            color="primary"
            v-bind="attrs"
            v-on="{ ...tooltip, ...dialog }"
          >
            <v-icon small> mdi-pencil </v-icon>
          </v-btn>
        </template>
        <span>modifier</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Modifier un plat</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="7">
                <v-text-field
                  v-model="plat.nom"
                  :errors="errors.nom.exist"
                  :error-messages="errors.nom.message"
                  dense
                  outlined
                >
                  <template #label>
                    Nom <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="plat.prix_vente"
                  :errors="errors.prix_vente.exist"
                  :error-messages="errors.prix_vente.message"
                  dense
                  outlined
                  type="number"
                  min="0"
                >
                  <template #label>
                    Prix de vente
                    <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="plat.categorie_id"
                  :items="categories"
                  item-value="id"
                  item-text="nom"
                  dense
                  outlined
                  append-outer-icon="mdi-plus-thick"
                  @click:append-outer="dialog1 = true"
                >
                  <template #label>
                    Categorie <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-autocomplete>
              </v-col>
              <create-categorie
                v-model="dialog1"
                :restaurant="restaurant"
                element="plat"
              />
              <v-col cols="12">
                <v-textarea
                  v-model="plat.description"
                  dense
                  outlined
                  label="Commentaires"
                ></v-textarea>
              </v-col>
            </v-row>
            <center><h4>Ingrédients du plat</h4></center>
            <simple-multiple-input
              :key="remount"
              v-model="ingredients"
              field="Articles"
              :items="articles"
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
import SimpleMultipleInput from '../SimpleMultipleInput.vue'
import CreateCategorie from '~/components/externe/CreateCategorieExterne.vue'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'

export default {
  components: { CreateCategorie, SimpleMultipleInput },
  props: {
    articles: {
      type: Array,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
    restaurant: {
      type: Number,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialogue: false,
      dialog1: false,
      ingredients: [],
      remount: false,
      plat: {
        categorie_id: null,
        prix_vente: null,
        nom: null,
        restaurant_id: this.restaurant,
      },
      errors: {
        prix_vente: { exist: false, message: null },
        nom: { exist: false, message: null },
      },
    }
  },
  mounted() {
    const { categorie, articles, ...rest } = this.item
    this.ingredients = JSON.parse(JSON.stringify(articles))
    this.plat = Object.assign({}, rest)
  },
  methods: {
    ...mapActions('externe/plat', ['modifier']),
    reinitialise() {
      errorsInitialise(this.errors)
      const { categorie, articles, ...rest } = this.item
      this.ingredients = JSON.parse(JSON.stringify(articles))
      this.plat = Object.assign({}, rest)
      this.dialogue = false
      this.remount = !this.remount
    },
    save() {
      if (this.ingredients.length >= 1) {
        this.modifier({ ...this.plat, articles: this.ingredients })
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
      } else {
        this.$notifier.show({
          text:
            'Un plat doit contenir au moins deux Ingrédients (articles) distincts',
          variant: 'error',
        })
      }
    },
  },
}
</script>

<style></style>
