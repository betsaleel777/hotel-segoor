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
        <span class="headline primary--text">Créer un article</span>
      </v-card-title>
      <v-card-text>
        <v-form id="form" ref="form" enctype="multipart/form-data">
          <v-container>
            <v-row>
              <!-- image -->
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
                  v-model="produit.image"
                  label="Image du produit"
                  required
                  @change="onFileChange"
                ></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="produit.nom"
                  :errors="errors.nom.exist"
                  :error-messages="errors.nom.message"
                  dense
                  outlined
                  label="Description"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-radio-group
                  v-model="produit.mode"
                  :error="errors.mode.exist"
                  :error-messages="errors.mode.message"
                  dense
                  row
                  @change="mesureCheck"
                >
                  <v-radio
                    label="Unité"
                    color="primary"
                    value="unité"
                  ></v-radio>
                  <v-radio
                    label="Mesure"
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
                  dense
                  row
                >
                  <v-radio
                    label="Standard"
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
              <v-col v-if="mesurable" cols="12">
                <v-text-field
                  v-model="produit.mesure"
                  outlined
                  dense
                  label="Mesuré en"
                  placeholder="Veuillez spécifier l'unité de mesure de l'article"
                ></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="produit.etagere"
                  dense
                  outlined
                  label="Etagere"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  v-model="produit.categorie"
                  :errors="errors.categorie.exist"
                  :error-messages="errors.categorie.message"
                  :items="categoriesLocales"
                  return-object
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
              <v-col>
                <v-textarea
                  v-model="produit.description"
                  label="Commentaire"
                  auto-grow
                  outlined
                  rows="5"
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
import CreateCategorie from './CreateCategorie'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'
import imagePreviewMixin from '~/components/mixins/ImagePreviewMixin'
export default {
  components: {
    CreateCategorie,
  },
  mixins: [imagePreviewMixin],
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
  data: () => {
    const defaultForm = {
      mode: '',
      type: '',
      image: [],
      nom: '',
      mesure: '',
      description: '',
      etagere: '',
      categorie: {},
    }
    return {
      dialog: false,
      mesurable: false,
      produit: defaultForm,
      errors: {
        mode: { exist: false, message: null },
        type: { exist: false, message: null },
        image: { exist: false, message: null },
        nom: { exist: false, message: null },
        mesure: { exist: false, message: null },
        categorie: { exist: false, message: null },
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
      errorsInitialise(this.errors)
      this.dialog = false
    },
    mesureCheck() {
      if (this.produit.mode === 'poids') {
        this.mesurable = true
      } else {
        this.mesurable = false
        this.produit.mesure = ''
      }
    },
    pushCategorie(categorie) {
      this.categoriesLocales.push(categorie)
    },
    save() {
      this.produit.categorie = this.produit.categorie
        ? this.produit.categorie.id
        : null
      this.$axios
        .post(
          'stock/produits/new',
          { ...this.produit }
          // {
          //   headers: {
          //     'Content-Type': 'multipart/form-data',
          //   },
          // }
        )
        .then((result) => {
          const { message, produit } = result.data
          // copier l'image upload
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
