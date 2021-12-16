<template>
  <v-dialog v-model="dialogue" persistent max-width="600px">
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
        <span class="headline primary--text">modifier un artisan</span>
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
              element="réparation"
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
        <v-btn color="primary" text @click="save"> modifier </v-btn>
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
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => {
    return {
      dialogue: false,
      dialog1: false,
      newCategorieSet: false,
      artisan: {
        nom: null,
        prenom: null,
        categorie_id: null,
        telephone: null,
        adresse: null,
        email: null,
      },
      errors: {
        nom: { exist: false, message: null },
        prenom: { exist: false, message: null },
        categorie_id: { exist: false, message: null },
        telephone: { exist: false, message: null },
      },
    }
  },
  mounted() {
    this.artisan = Object.assign({}, this.item)
  },
  methods: {
    ...mapActions('maintenance/provider', ['modifier']),
    reinitialise() {
      this.artisan = Object.assign({}, this.item)
      errorsInitialise(this.errors)
      this.dialogue = false
      this.newCategorieSet = false
    },
    save() {
      this.modifier(this.artisan)
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
