<template>
  <v-dialog v-model="dialog" persistent max-width="850px">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" dark color="primary" v-on="on">
        <v-icon left>mdi-plus-thick</v-icon>
        AJOUTER
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Créer une dépense</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="depense.nom"
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
              <v-col cols="12">
                <v-textarea
                  v-model="depense.description"
                  dense
                  outlined
                  label="Commentaires"
                ></v-textarea>
              </v-col>
            </v-row>
            <center><h4>Articles Achetés</h4></center>
            <amount-multiple-input
              :key="remount"
              v-model="pannier"
              field="Articles"
              :items="articles"
            />
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
import AmountMultipleInput from '~/components/externe/AmountMultipleInput.vue'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'

export default {
  components: { AmountMultipleInput },
  props: {
    articles: {
      type: Array,
      required: true,
    },
    restaurant: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      dialog1: false,
      pannier: [],
      remount: false,
      depense: {
        nom: null,
        description: null,
        restaurant_id: this.restaurant,
      },
      errors: {
        nom: { exist: false, message: null },
      },
    }
  },
  methods: {
    ...mapActions('externe/depense', ['ajouter']),
    reinitialise() {
      this.pannier = []
      this.depense = {
        nom: null,
        description: null,
        restaurant_id: this.restaurant,
      }
      errorsInitialise(this.errors)
      this.dialog = false
      this.remount = !this.remount
    },
    save() {
      if (this.pannier.length > 0) {
        this.ajouter({ ...this.depense, pannier: this.pannier })
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
      } else {
        this.$notifier.show({
          text:
            'la liste des article est vide, Veuillez selectionner au moins un artcile',
          variant: 'error',
        })
      }
    },
  },
}
</script>

<style></style>
