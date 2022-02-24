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
        <span class="headline primary--text"
          >Modifier categorie {{ element }}</span
        >
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-5">
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="nom"
                  :error="errors.nom.exist"
                  :error-messages="errors.nom.message"
                  dense
                  outlined
                  label="Nom"
                  required
                >
                  <template #label>
                    Nom <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-text-field>
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
import {
  errorsWriting,
  errorsInitialise,
} from '~/components/helper/errorsHandle'
export default {
  props: {
    restaurant: {
      type: Number,
      required: true,
    },
    element: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialogue: null,
      nom: null,
      errors: { nom: { exist: false, message: null } },
    }
  },
  mounted() {
    this.nom = this.item.nom
  },
  methods: {
    reinitialise() {
      this.dialogue = false
      this.nom = this.item.nom
      errorsInitialise(this.errors)
    },
    save() {
      this.$store
        .dispatch(`externe/parametre/categorie-${this.element}/modifier`, {
          nom: this.nom,
          id: this.item.id,
          restaurant_id: this.restaurant,
        })
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
