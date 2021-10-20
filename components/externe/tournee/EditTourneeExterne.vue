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
        <span class="headline primary--text">Modifier une tournee</span>
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
                  v-model="tournee.nom"
                  :errors="errors.nom.exist"
                  :error-messages="errors.nom.message"
                  dense
                  outlined
                >
                  <template #label>
                    Nom <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="tournee.prix_vente"
                  :errors="errors.prix_vente.exist"
                  :error-messages="errors.prix_vente.message"
                  dense
                  outlined
                  type="number"
                  min="0"
                >
                  <template #label>
                    Prix de vente
                    <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="tournee.nombre"
                  :errors="errors.nombre.exist"
                  :error-messages="errors.nombre.message"
                  dense
                  outlined
                  type="number"
                  min="0"
                >
                  <template #label>
                    Nombre de ballons
                    <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  v-model="tournee.article_id"
                  :errors="errors.article_id.exist"
                  :error-messages="errors.article_id.message"
                  :items="articles"
                  item-value="id"
                  item-text="nom"
                  dense
                  outlined
                  required
                >
                  <template #label>
                    Article
                    <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="tournee.categorie_id"
                  :items="categories"
                  item-value="id"
                  item-text="nom"
                  dense
                  outlined
                  label="Categorie"
                >
                  <template #append-outer>
                    <v-tooltip top>
                      <template #activator="{ on, attrs }">
                        <v-btn
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
                  element="tournee"
                />
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

export default {
  components: { CreateCategorie },
  props: {
    articles: {
      type: Array,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
    restaurant: {
      type: Number,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialogue: false,
      dialog1: false,
      tournee: {
        article_id: null,
        categorie_id: null,
        prix_vente: null,
        nom: null,
        nombre: null,
        restaurant_id: this.restaurant,
      },
      errors: {
        article_id: { exist: false, message: null },
        prix_vente: { exist: false, message: null },
        nom: { exist: false, message: null },
        nombre: { exist: false, message: null },
      },
    }
  },
  mounted() {
    const { categorie, ...rest } = this.item
    this.tournee = Object.assign({}, rest)
  },
  methods: {
    ...mapActions('externe/tournee', ['modifier']),
    reinitialise() {
      errorsInitialise(this.errors)
      this.dialogue = false
    },
    save() {
      this.modifier(this.tournee)
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
  },
}
</script>

<style></style>
