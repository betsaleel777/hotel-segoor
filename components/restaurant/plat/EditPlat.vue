<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn
        elevation="1"
        icon
        fab
        dark
        x-small
        color="primary"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon small> mdi-pencil </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline primary--text">modifier un plat</span>
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
                ></v-text-field>
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
                ></v-autocomplete>
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
            <ingredient-list
              :ingredients="ingredients"
              @new-in-list="listeUpdate"
            />
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
                ></v-text-field>
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
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="reinitialise"> Fermer </v-btn>
        <v-btn color="blue darken-1" text @click="save"> modifier</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import CreateCategorie from './CreateCategorie.vue'
import IngredientList from './IngredientList'
import {
  errorsInitialise,
  // eslint-disable-next-line no-unused-vars
  errorsWriting,
} from '~/components/helper/errorsHandle'
import imagePreviewMixin from '~/components/mixins/ImagePreviewMixin'

export default {
  components: { CreateCategorie, IngredientList },
  mixins: [imagePreviewMixin],
  props: {
    item: {
      type: Object,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
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
    const defaultTab = Object.freeze([])
    return {
      dialog: false,
      plat: Object.assign({}, defaultForm),
      ingredients: Object.assign([], defaultTab),
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
  mounted() {
    this.plat = Object.assign({}, this.item)
    this.ingredients = Object.assign([], this.item.ingredients)
  },
  beforeUpdate() {
    this.categoriesLocales = this.categories
  },
  methods: {
    reinitialise() {
      this.plat = Object.assign({}, this.item)
      this.ingredients = Object.assign([], this.item.ingredients)
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
        .catch((err) => {
          this.$toast.error(err.response.data.message)
        })
    },
    save() {
      const ingredients = this.ingredients
      if (ingredients.length > 0) {
        this.$axios
          .put('restaurant/plats/' + this.item.id, {
            ...this.plat,
            ingredients,
          })
          .then((result) => {
            const { message, plat } = result.data
            this.reinitialise()
            this.$notifier.show({ text: message, variant: 'success' })
            this.$emit('edited-plat', plat)
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
          text: 'Aucun ingrédients de préparation indiqué.',
          variant: 'error',
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
