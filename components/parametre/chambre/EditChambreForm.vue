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
        <span class="headline primary--text">modifier chambre </span>
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
              <v-col cols="12" sm="9" md="10">
                <v-autocomplete
                  v-model="chambre.categorie"
                  :errors="errors.categorie.exist"
                  :error-messages="errors.categorie.message"
                  :items="categories"
                  item-value="id"
                  item-text="nom"
                  dense
                  outlined
                  label="Standing"
                  required
                >
                  <template #label>
                    Standing<span class="red--text"><strong> *</strong></span>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="3" md="2">
                <create-categorie-form />
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
      dialogue: false,
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
    }
  },
  mounted() {
    this.chambre = this.item
    this.chambre.montant = this.item.prix_vente
  },
  methods: {
    ...mapActions('parametre/chambre', ['modifier']),
    reinitialise() {
      this.chambre = this.item
      this.errors = {
        categorie: { exist: false, message: null },
        montant: { exist: false, message: null },
        nom: { exist: false, message: null },
      }
      this.dialogue = false
    },
    save() {
      this.modifier({ id: this.item.id, ...this.chambre })
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
