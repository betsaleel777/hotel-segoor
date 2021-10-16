<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn text v-bind="attrs" color="blue darken-4" v-on="on">
        nouveau restaurant
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Nouveau Restaurant</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-text-field
              v-model="restaurant.nom"
              :errors="errors.nom.exist"
              :error-messages="errors.nom.message"
              dense
              outlined
              required
            >
              <template #label>
                Nom<span class="red--text"><strong> *</strong></span>
              </template>
            </v-text-field>
            <v-text-field
              v-model="restaurant.location"
              :errors="errors.location.exist"
              :error-messages="errors.location.message"
              dense
              outlined
              required
            >
              <template #label>
                Location<span class="red--text"><strong> *</strong></span>
              </template>
            </v-text-field>
            <v-text-field
              v-model="restaurant.contact"
              :errors="errors.contact.exist"
              :error-messages="errors.contact.message"
              dense
              outlined
              required
            >
              <template #label>
                Contact<span class="red--text"><strong> *</strong></span>
              </template>
            </v-text-field>
            <v-text-field
              v-model="restaurant.email"
              :errors="errors.email.exist"
              :error-messages="errors.email.message"
              dense
              outlined
              required
            >
              <template #label>
                Adresse mail<span class="red--text"><strong> *</strong></span>
              </template>
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
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'

export default {
  data: () => {
    return {
      dialog: false,
      restaurant: {
        nom: null,
        location: null,
        email: null,
        contact: null,
      },
      errors: {
        nom: { exist: false, message: null },
        location: { exist: false, message: null },
        email: { exist: false, message: null },
        contact: { exist: false, message: null },
      },
    }
  },
  methods: {
    ...mapActions('externe/restaurant', ['ajouter']),
    reinitialise() {
      this.$refs.form.reset()
      errorsInitialise(this.errors)
      this.dialog = false
    },
    save() {
      this.ajouter(this.restaurant)
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
