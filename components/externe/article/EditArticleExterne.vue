<template>
  <v-dialog v-model="dialogue" persistent max-width="620px">
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
        <span class="headline primary--text">Créer un article</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-5">
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
                  v-model="article.image"
                  label="Image d'article"
                  required
                  @change="onFileChange"
                ></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="article.nom"
                  :errors="errors.nom.exist"
                  :error-messages="errors.nom.message"
                  dense
                  outlined
                  label="Description"
                  required
                >
                  <template #label>
                    Description
                    <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-checkbox
                  v-model="article.pour_plat"
                  dense
                  @change="priceDisabled = !priceDisabled"
                >
                  <template #label>
                    <span class="text-caption">Utilisé pour plat</span>
                  </template>
                </v-checkbox>
              </v-col>
              <v-col cols="4">
                <v-checkbox v-model="article.pour_cocktail" dense>
                  <template #label>
                    <span class="text-caption">Utilisé pour cocktail</span>
                  </template>
                </v-checkbox>
              </v-col>
              <v-col cols="4">
                <v-checkbox
                  v-model="article.pour_tournee"
                  dense
                  @change="tournable"
                >
                  <template #label>
                    <span class="text-caption">Utilisé pour tournée</span>
                  </template>
                </v-checkbox>
              </v-col>
              <v-col cols="12">
                <v-radio-group
                  v-model="article.type"
                  :error="errors.type.exist"
                  :error-messages="errors.type.message"
                  dense
                  row
                >
                  <template #default>
                    <v-row>
                      <v-col cols="4">
                        <v-radio
                          label="Standard"
                          color="primary"
                          value="standard"
                        >
                          <template #label>
                            Standard
                            <span class="red--text"><strong>* </strong></span>
                          </template>
                        </v-radio>
                      </v-col>
                      <v-col cols="4">
                        <v-radio
                          label="Assaisonement"
                          color="primary"
                          value="assaisonement"
                        >
                          <template #label>
                            Assaisonement
                            <span class="red--text"><strong>* </strong></span>
                          </template>
                        </v-radio>
                      </v-col>
                    </v-row>
                  </template>
                </v-radio-group>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="article.mesure"
                  outlined
                  dense
                  label="Mesuré en"
                  placeholder="Mesure d'article"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="article.contenance"
                  outlined
                  dense
                  label="Contenance"
                  :suffix="article.mesure"
                  placeholder="Contenance d'article"
                ></v-text-field>
              </v-col>
              <v-col cols="">
                <v-text-field
                  v-model="article.etagere"
                  dense
                  outlined
                  label="Etagere"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  v-model="article.categorie_id"
                  :errors="errors.categorie_id.exist"
                  :error-messages="errors.categorie_id.message"
                  :items="categories"
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
                  <template #append-outer>
                    <v-tooltip top>
                      <template #activator="{ on, attrs }">
                        <v-btn
                          color="indigo"
                          icon
                          v-bind="attrs"
                          @click="dialog1 = true"
                          v-on="on"
                          ><v-icon>mdi-plus-thick</v-icon></v-btn
                        >
                      </template>
                      <span>Créer catégorie</span>
                    </v-tooltip>
                  </template>
                </v-autocomplete>
                <create-categorie
                  v-model="dialog1"
                  :restaurant="restaurant"
                  element="'article'"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="article.prix_vente"
                  :errors="errors.prix_vente.exist"
                  :error-messages="errors.prix_vente.message"
                  :disabled="article.type === 'assaisonement' || priceDisabled"
                  suffix="FCFA"
                  dense
                  label="Prix de vente"
                  required
                >
                </v-text-field>
              </v-col>
              <v-col>
                <v-textarea
                  v-model="article.description"
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
        <v-btn color="error" text @click="reinitialise"> Fermer </v-btn>
        <v-btn color="primary" text @click="save"> Modifier </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import CreateCategorie from '~/components/externe/CreateCategorieExterne.vue'
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
    item: {
      type: Object,
      required: true,
    },
    restaurant: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      dialogue: false,
      dialog1: false,
      mesurable: false,
      article: {
        type: '',
        image: null,
        nom: '',
        mesure: '',
        prix_vente: 0,
        pour_plat: false,
        pour_cocktail: false,
        pour_tournee: false,
        description: '',
        etagere: '',
        categorie_id: null,
        restaurant_id: this.restaurant,
      },
      priceDisabled: false,
      errors: {
        type: { exist: false, message: null },
        image: { exist: false, message: null },
        nom: { exist: false, message: null },
        prix_vente: { exist: false, message: null },
        mesure: { exist: false, message: null },
        categorie_id: { exist: false, message: null },
      },
    }
  },
  mounted() {
    const { categorie, ...rest } = this.item
    this.article = Object.assign({}, rest)
  },
  methods: {
    ...mapActions('externe/article', ['modifier']),
    reinitialise() {
      this.dialogue = false
      errorsInitialise(this.errors)
    },
    save() {
      this.modifier(this.article)
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
    tournable() {
      if (this.article.pour_tournee) {
        this.mesurable = true
        this.article.mesure = 'cl'
      } else {
        this.mesurable = false
        this.article.mesure = ''
      }
    },
  },
}
</script>

<style></style>
