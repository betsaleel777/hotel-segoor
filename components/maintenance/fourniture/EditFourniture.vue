<template>
  <v-dialog v-model="dialogue" persistent max-width="560px">
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
        <span class="headline primary--text">Modifier Equipement</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-text-field
              v-model="fourniture.nom"
              :errors="errors.nom.exist"
              :error-messages="errors.nom.message"
              dense
              outlined
            >
              <template #label>
                Nom<span class="red--text"><strong> *</strong></span>
              </template>
            </v-text-field>
            <v-textarea
              v-model="fourniture.description"
              dense
              outlined
              label="Description"
            >
            </v-textarea>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="reinitialise"> fermer </v-btn>
        <v-btn color="primary" text @click="save"> modifier </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => {
    return {
      dialogue: false,
      fourniture: {
        description: null,
        nom: null,
      },
      errors: {
        nom: { exist: false, message: null },
      },
    }
  },
  mounted() {
    this.fourniture = Object.assign({}, this.item)
  },
  methods: {
    ...mapActions('maintenance/fourniture', ['modifier']),
    reinitialise() {
      this.fourniture = Object.assign({}, this.item)
      errorsInitialise(this.errors)
      this.dialogue = false
    },
    save() {
      this.modifier(this.fourniture)
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
