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
        <span class="headline primary--text">créer une chambre</span>
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
                  label="Categorie"
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
        <v-btn color="blue darken-1" text @click="reinitialise"> Fermer </v-btn>
        <v-btn color="blue darken-1" text @click="save"> Créer </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import CreateCategorieForm from './CreateCategorieForm.vue'
export default {
  components: { CreateCategorieForm },
  props: {
    categories: {
      type: Array,
      required: true,
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
        .post('api/gestion-chambre/chambres/new', { ...this.chambre })
        .then((result) => {
          const { message, chambre } = result.data
          this.reinitialise()
          this.$store.commit('SNACKBAR', message)
          this.$emit('new-chambre', chambre)
        })
        .catch((err) => {
          const { data } = err.response
          if (data) {
            this.$refs.form.reset()
            this.errorsWriting(data)
          }
        })
    },
    errorsWriting(errors) {
      if (errors.nom) {
        this.errors.nom.exist = true
        this.errors.nom.message = errors.nom[0]
      }
      if (errors.categorie) {
        this.errors.categorie.exist = true
        this.errors.categorie.message = errors.categorie[0]
      }
      if (errors.montant) {
        this.errors.montant.exist = true
        this.errors.montant.message = errors.montant[0]
      }
    },
  },
}
</script>

<style></style>
