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
        <span class="headline primary--text">créer un plat</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <!-- presentation du plat -->
            <v-row>
              <!-- image -->
              <v-col cols="12">
                <div class="text-center"><h4>Présention du Plat</h4></div>
              </v-col>
              <v-col cols="4"></v-col>
              <v-col cols="4">
                <div>
                  <v-img v-if="imagePreview" :src="imagePreview" />
                </div>
              </v-col>
              <v-col cols="4"></v-col>
              <v-col cols="12">
                <v-file-input
                  ref="image"
                  v-model="plat.image"
                  label="Image du plat"
                  required
                  @change="onFileChange"
                ></v-file-input>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="plat.nom"
                  :errors="errors.nom.exist"
                  :error-messages="errors.nom.message"
                  dense
                  outlined
                  label="Nom du Plat"
                  required
                >
                  <template #label>
                    Nom du plat
                    <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="5">
                <v-autocomplete
                  v-model="plat.categorie"
                  :errors="errors.categorie.exist"
                  :error-messages="errors.categorie.message"
                  :items="categoriesLocales"
                  item-value="id"
                  item-text="nom"
                  dense
                  outlined
                  label="Categorie"
                  required
                >
                  <template #label>
                    Categorie <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="1">
                <create-categorie @new-categorie="pushCategorie" />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="plat.description"
                  outlined
                  label="Description"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <div class="text-center"><h4>Liste des Ingrédients</h4></div>
              </v-col>
            </v-row>
            <!-- liste des ingredients -->
            <ingredient-list :ingredients="[]" @new-in-list="listeUpdate" />
            <v-row>
              <v-btn
                :disabled="!(ingredients.length > 0)"
                dark
                class="my-10"
                color="primary"
                block
                outlined
                @click="price"
                ><v-icon dark small>mdi-cog</v-icon> calcul du prix minimal de
                revient du plat</v-btn
              >
              <!-- prix d'achat et de vente -->
              <v-col cols="6">
                <v-text-field
                  v-model="plat.achat"
                  :errors="errors.achat.exist"
                  :error-messages="errors.achat.message"
                  dense
                  outlined
                  label="Coût de revient"
                  required
                >
                  <template #label>
                    Coût de revient<span class="red--text"
                      ><strong>* </strong></span
                    >
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="plat.vente"
                  :errors="errors.vente.exist"
                  :error-messages="errors.vente.message"
                  dense
                  outlined
                  label="Prix de vente"
                  required
                >
                  <template #label>
                    Prix de vente<span class="red--text"
                      ><strong>* </strong></span
                    >
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
import CreateCategorie from './CreateCategorie.vue'
import IngredientList from './IngredientList'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'
import imagePreviewMixin from '~/components/mixins/ImagePreviewMixin'

export default {
  components: { CreateCategorie, IngredientList },
  mixins: [imagePreviewMixin],
  props: {
    categories: {
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
      categorie: null,
      achat: null,
      vente: null,
      nom: null,
      image: [],
      description: '',
    })
    return {
      dialog: false,
      plat: Object.assign({}, defaultForm),
      ingredients: [],
      errors: {
        categorie: { exist: false, message: null },
        achat: { exist: false, message: null },
        vente: { exist: false, message: null },
        description: { exist: false, message: null },
        image: { exist: false, message: null },
        nom: { exist: false, message: null },
      },
      categoriesLocales: [],
    }
  },
  beforeUpdate() {
    this.categoriesLocales = this.categories
  },
  methods: {
    reinitialise() {
      this.$refs.form.reset()
      this.ingredients.splice(0)
      errorsInitialise(this.errors)
      this.dialog = false
    },
    pushCategorie(categorie) {
      this.categoriesLocales.push(categorie)
    },
    price() {
      this.$axios
        .post('restaurant/plats/prix-minimal', {
          ingredients: this.ingredients,
        })
        .then((result) => {
          this.plat.achat = result.data.achat
        })
    },
    save() {
      const ingredients = this.ingredients
      if (ingredients.length > 0) {
        this.$axios
          .post('restaurant/plats/new', { ...this.plat, ingredients })
          .then((result) => {
            const { message, plat } = result.data
            this.$notifier.show({ text: message, variant: 'success' })
            this.reinitialise()
            this.$emit('new-plat', plat)
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
          text: 'Aucun ingrédients de préparation indiqués.',
          variant: 'warning',
        })
      }
    },
    listeUpdate(ingredients) {
      this.ingredients = ingredients
    },
  },
}
</script>

<style></style>
