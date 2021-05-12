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
        <span class="headline primary--text">créer un produit</span>
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
              <v-col cols="5">
                <v-text-field
                  v-model="produit.nom"
                  :errors="errors.nom.exist"
                  :error-messages="errors.nom.message"
                  dense
                  outlined
                  label="libelle"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="7">
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
                    label="Poids"
                    color="primary"
                    value="poids"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col v-if="mesurable" cols="12">
                <v-select
                  v-model="produit.mesure"
                  :items="mesures"
                  label="Mesuré en"
                ></v-select>
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="produit.seuil"
                  :errors="errors.seuil.exist"
                  :error-messages="errors.seuil.message"
                  dense
                  :suffix="`${produit.mesure}`"
                  outlined
                  type="number"
                  label="Seuil"
                  required
                ></v-text-field>
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
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'
import imagePreviewMixin from '~/components/mixins/ImagePreviewMixin'

export default {
  mixins: [imagePreviewMixin],
  data: () => {
    const defaultForm = {
      mode: '',
      type: '',
      image: [],
      seuil: '',
      nom: '',
      mesure: '',
    }
    return {
      dialog: false,
      mesurable: false,
      mesures: ['kg', 'g', 'dg'],
      produit: defaultForm,
      errors: {
        mode: { exist: false, message: null },
        type: { exist: false, message: null },
        image: { exist: false, message: null },
        seuil: { exist: false, message: null },
        nom: { exist: false, message: null },
        mesure: { exist: false, message: null },
      },
    }
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
    save() {
      this.$axios
        .post(
          'restaurant/produits/new',
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
