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
        <span class="headline primary--text">Modifier l'article</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
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
                >
                  <template #label>
                    Description
                    <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-checkbox
                  v-model="produit.pour_plat"
                  dense
                  label="Pour préparer plat"
                  @change="priceDisabled = !priceDisabled"
                ></v-checkbox>
              </v-col>
              <v-col cols="6">
                <v-checkbox
                  v-model="produit.pour_tournee"
                  dense
                  label="Utilisé pour tournée"
                ></v-checkbox>
              </v-col>
              <v-col cols="5">
                <v-radio-group
                  v-model="produit.mode"
                  disabled
                  :error="errors.mode.exist"
                  :error-messages="errors.mode.message"
                  dense
                  row
                  @change="mesureCheck"
                >
                  <v-radio label="Unité" color="primary" value="unité">
                    <template #label>
                      Unité
                      <span class="red--text"><strong>* </strong></span>
                    </template>
                  </v-radio>
                  <v-radio label="Mesure" color="primary" value="poids">
                    <template #label>
                      Mesure
                      <span class="red--text"><strong>* </strong></span>
                    </template>
                  </v-radio>
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
                  <v-radio label="Standard" color="primary" value="standard">
                    <template #label>
                      Standard
                      <span class="red--text"><strong>* </strong></span>
                    </template>
                  </v-radio>
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
                </v-radio-group>
              </v-col>
              <v-col v-if="mesurable" cols="12">
                <v-text-field
                  v-model="produit.mesure"
                  disabled
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
                  :items="categories"
                  return-object
                  item-value="id"
                  item-text="nom"
                  dense
                  outlined
                  label="Categorie"
                  required
                >
                  <template #label>
                    Categorie
                    <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="1">
                <create-categorie />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="produit.montant"
                  :disabled="produit.type === 'assaisonement' || priceDisabled"
                  :errors="errors.montant.exist"
                  :error-messages="errors.montant.message"
                  suffix="FCFA"
                  dense
                  label="Prix de vente"
                  required
                >
                </v-text-field>
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
        <v-btn color="error" text @click="reinitialise"> Fermer </v-btn>
        <v-btn color="primary" text @click="save"> Modifier </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
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
    return {
      dialogue: false,
      mesurable: false,
      produit: {
        mode: '',
        type: '',
        image: [],
        nom: '',
        mesure: '',
        montant: 0,
        pour_plat: false,
        pour_tournee: false,
        description: '',
        etagere: '',
        categorie: null,
      },
      priceDisabled: false,
      errors: {
        mode: { exist: false, message: null },
        type: { exist: false, message: null },
        image: { exist: false, message: null },
        montant: { exist: false, message: null },
        nom: { exist: false, message: null },
        mesure: { exist: false, message: null },
        categorie: { exist: false, message: null },
      },
    }
  },
  mounted() {
    this.produit = Object.assign({}, this.item)
    if (this.item.mode === 'poids') {
      this.mesurable = true
    }
  },
  methods: {
    ...mapActions('stock/article', ['modifier']),
    reinitialise() {
      this.produit = Object.assign({}, this.item)
      errorsInitialise(this.errors)
      this.dialogue = false
    },
    mesureCheck() {
      if (this.produit.mode === 'poids') {
        this.mesurable = true
      } else {
        this.mesurable = false
        this.produit.mesure = ''
      }
    },
    save() {
      this.produit.categorie = this.produit.categorie
        ? this.produit.categorie.id
        : null
      this.modifier({ id: this.item.id, ...this.produit })
        .then((result) => {
          this.dialogue = false
          this.$notifier.show({ text: result.message, variant: 'success' })
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
