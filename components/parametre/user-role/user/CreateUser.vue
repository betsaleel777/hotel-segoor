<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" dark color="primary" v-on="on">
        <v-icon left>mdi-plus-thick</v-icon>
        AJOUTER
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Créer Utilisateur</span>
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
                  v-model="utilisateur.name"
                  :error="errors.name.exist"
                  :error-messages="errors.name.message"
                  dense
                  outlined
                  label="Nom"
                >
                  <template #label>
                    Nom
                    <span class="red--text"><strong> *</strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="utilisateur.email"
                  :error="errors.email.exist"
                  :error-messages="errors.email.message"
                  prepend-inner-icon="mdi-email"
                  dense
                  outlined
                  label="Email"
                  type="email"
                >
                  <template #label>
                    Email
                    <span class="red--text"><strong> *</strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="utilisateur.password"
                  :error="errors.password.exist"
                  :error-messages="errors.password.message"
                  prepend-inner-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="[rules.required, rules.min, rules.strength]"
                  dense
                  outlined
                  label="Mot de passe"
                  @click:append="showPassword = !showPassword"
                >
                  <template #label>
                    Mot de passe
                    <span class="red--text"><strong> *</strong></span>
                  </template>
                </v-text-field>
                <v-progress-linear
                  :background-opacity="0.2"
                  :color="score.color"
                  :value="score.value"
                ></v-progress-linear>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="utilisateur.password_confirmation"
                  :error="errors.password_confirmation.exist"
                  :error-messages="errors.password_confirmation.message"
                  dense
                  outlined
                  label="Confirmer le mot de passe"
                  type="password"
                >
                  <template #label>
                    Confirmer le mot de passe
                    <span class="red--text"><strong> *</strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="utilisateur.roles"
                  :errors="errors.roles.exist"
                  :error-messages="errors.roles.message"
                  clearable
                  :items="roles"
                  item-value="id"
                  item-text="name"
                  multiple
                  dense
                  outlined
                  label="Rôles"
                  required
                >
                  <template #label>
                    Rôles<span class="red--text"><strong> *</strong></span>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="reinitialise"> Fermer </v-btn>
        <v-btn :disabled="!canSave" color="primary" text @click="save">
          Créer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import zxcvbn from 'zxcvbn'
import {
  errorsWriting,
  errorsInitialise,
} from '~/components/helper/errorsHandle'

export default {
  props: {
    roles: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    showPassword: false,
    canSave: false,
    utilisateur: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      roles: [],
    },
    rules: {
      required: (value) => !!value || 'le mot de passe est requis',
      min: (v) => v.length >= 6 || 'Utiliser au minimum 6 caractères',
      strength: (v) => zxcvbn(v).score >= 3 || 'Votre mot de passe est faible.',
    },
    errors: {
      name: { exist: false, message: null },
      email: { exist: false, message: null },
      password: { exist: false, message: null },
      password_confirmation: { exist: false, message: null },
      roles: { exist: false, message: null },
    },
  }),
  computed: {
    score() {
      const result = zxcvbn(this.utilisateur.password)
      switch (result.score) {
        case 4:
          return {
            color: 'light-blue',
            value: 100,
          }
        case 3:
          return {
            color: 'light-green',
            value: 75,
          }
        case 2:
          return {
            color: 'yellow',
            value: 50,
          }
        case 1:
          return {
            color: 'orange',
            value: 25,
          }
        default:
          return {
            color: 'red',
            value: 0,
          }
      }
    },
  },
  watch: {
    'utilisateur.password_confirmation'(password) {
      if (this.utilisateur.password.length > 0) {
        this.canSave = password === this.utilisateur.password
      }
    },
  },
  methods: {
    ...mapActions({ ajouter: 'user/ajouter' }),
    reinitialise() {
      this.dialog = false
      errorsInitialise(this.errors)
      this.utilisateur = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [],
      }
    },
    save() {
      this.ajouter({
        ...this.utilisateur,
        user: this.user.id,
      })
        .then((result) => {
          this.$notifier.show({
            text: result.message,
            variant: 'success',
          })
          this.reinitialise()
          this.dialog = false
        })
        .catch((err) => {
          if (err.response.data) {
            errorsInitialise(this.errors)
            errorsWriting(err.response.data, this.errors)
          }
        })
    },
  },
}
</script>

<style></style>
