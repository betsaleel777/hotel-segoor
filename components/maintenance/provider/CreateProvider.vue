<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" dark small color="primary" v-on="on">
        <v-icon left>mdi-plus-thick</v-icon>
        AJOUTER
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">créer un artisan</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-text-field
              v-model="artisan.nom"
              :errors="errors.nom.exist"
              :error-messages="errors.nom.message"
              dense
              outlined
            >
              <template #label>
                Nom<span class="red--text"><strong> *</strong></span>
              </template>
            </v-text-field>
            <v-text-field
              v-model="artisan.prenom"
              :errors="errors.prenom.exist"
              :error-messages="errors.prenom.message"
              dense
              outlined
            >
              <template #label>
                Prénoms<span class="red--text"><strong> *</strong></span>
              </template>
            </v-text-field>
            <v-autocomplete
              v-model="artisan.categorie_id"
              :errors="errors.categorie_id.exist"
              :error-messages="errors.categorie_id.message"
              :items="categories"
              item-value="id"
              item-text="nom"
              dense
              outlined
              :disabled="newCategorieSet"
              append-outer-icon="mdi-plus"
              @click:append-outer="dialog1 = true"
            >
              <template #label>
                Spécialité<span class="red--text"><strong> *</strong></span>
              </template>
            </v-autocomplete>
            <create-categorie
              v-model="dialog1"
              element="reparation"
              @new-categorie="pushCategorie"
            />
            <v-text-field
              v-model="artisan.adresse"
              dense
              outlined
              label="Adresse"
            >
            </v-text-field>
            <v-text-field
              v-model="artisan.telephone"
              :errors="errors.telephone.exist"
              :error-messages="errors.telephone.message"
              dense
              outlined
            >
              <template #label>
                Téléphone<span class="red--text"><strong> *</strong></span>
              </template>
            </v-text-field>
            <v-text-field v-model="artisan.email" dense outlined label="Email">
            </v-text-field>
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
import { mapActions } from 'vuex'
import CreateCategorie from '~/components/CreateCategorie.vue'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'
export default {
  components: { CreateCategorie },
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
  data: () => {
    return {
      dialog: false,
      dialog1: false,
      newCategorieSet: false,
      artisan: {
        categorie_id: null,
        prenom: null,
        nom: null,
        adresse: null,
        telephone: null,
        email: null,
      },
      errors: {
        categorie_id: { exist: false, message: null },
        prenom: { exist: false, message: null },
        nom: { exist: false, message: null },
        telephone: { exist: false, message: null },
      },
    }
  },
  methods: {
    ...mapActions('maintenance/provider', ['ajouter']),
    reinitialise() {
      this.$refs.form.reset()
      errorsInitialise(this.errors)
      this.dialog = false
      this.newCategorieSet = false
    },
    save() {
      this.ajouter(this.artisan)
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
    pushCategorie(id) {
      this.artisan.categorie_id = id
      this.newCategorieSet = true
    },
  },
}
</script>

<style></style>
