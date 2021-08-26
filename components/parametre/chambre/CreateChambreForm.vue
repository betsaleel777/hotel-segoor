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
        <span class="headline primary--text">créer une chambre</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="8">
                <v-text-field
                  v-model="chambre.nom"
                  :errors="errors.nom.exist"
                  :error-messages="errors.nom.message"
                  dense
                  outlined
                  label="libelle"
                  required
                >
                  <template #label>
                    libelle<span class="red--text"><strong> *</strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="chambre.montant"
                  :errors="errors.montant.exist"
                  :error-messages="errors.montant.message"
                  dense
                  outlined
                  label="Prix"
                  required
                >
                  <template #label>
                    Prix<span class="red--text"><strong> *</strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="9" md="11">
                <v-autocomplete
                  v-model="chambre.categorie"
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
                    Standing<span class="red--text"><strong> *</strong></span>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="3" md="1">
                <create-categorie-form @new-categorie="pushCategorie" />
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
import CreateCategorieForm from './CreateCategorieForm.vue'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'

export default {
  components: { CreateCategorieForm },
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
      montant: null,
      nom: null,
    })
    return {
      dialog: false,
      chambre: Object.assign({}, defaultForm),
      errors: {
        categorie: { exist: false, message: null },
        montant: { exist: false, message: null },
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
      errorsInitialise(this.errors)
      this.dialog = false
    },
    pushCategorie(categorie) {
      this.categoriesLocales.push(categorie)
    },
    save() {
      this.$axios
        .post('gestion-chambre/chambres/new', {
          ...this.chambre,
          user: this.user.id,
        })
        .then((result) => {
          const { message, chambre } = result.data
          this.$notifier.show({ text: message, variant: 'success' })
          this.$emit('new-chambre', chambre)
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
  },
}
</script>

<style></style>
