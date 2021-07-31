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
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text"
          >modifier chambre {{ chambre.code }}</span
        >
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
                ></v-text-field>
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
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="9" md="10">
                <v-autocomplete
                  v-model="chambre.categorie"
                  :errors="errors.categorie.exist"
                  :error-messages="errors.categorie.message"
                  :items="categoriesLocales"
                  item-value="id"
                  item-text="nom"
                  dense
                  outlined
                  label="Standing"
                  required
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="3" md="2">
                <create-categorie-form @new-categorie="pushCategorie" />
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
import CreateCategorieForm from './CreateCategorieForm.vue'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'
export default {
  components: { CreateCategorieForm },
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
      dialog: false,
      chambre: {
        id: null,
        categorie: null,
        montant: null,
        nom: '',
        standing: '',
      },
      errors: {
        categorie: { exist: false, message: null },
        montant: { exist: false, message: null },
        nom: { exist: false, message: null },
      },
      categoriesLocales: [],
    }
  },
  mounted() {
    this.chambre = Object.assign({}, this.item)
  },
  beforeUpdate() {
    this.categoriesLocales = this.categories
  },
  methods: {
    reinitialise() {
      this.chambre = Object.assign({}, this.item)
      this.errors = {
        categorie: { exist: false, message: null },
        montant: { exist: false, message: null },
        nom: { exist: false, message: null },
      }
      this.dialog = false
    },
    pushCategorie(categorie) {
      this.categoriesLocales.push(categorie)
    },
    save() {
      this.$axios
        .put('gestion-chambre/chambres/' + this.item.id, {
          ...this.chambre,
        })
        .then((result) => {
          const { message, chambre } = result.data
          this.dialog = false
          this.$notifier.show({ text: message, variant: 'success' })
          this.$emit('edited-chambre', chambre)
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
