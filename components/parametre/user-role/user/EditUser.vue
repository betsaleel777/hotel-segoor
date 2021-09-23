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
        <span class="headline primary--text">Modifier utilisateur</span>
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
                  v-model="utilisateur.oldPassword"
                  :error="errors.oldPassword.exist"
                  :error-messages="errors.oldPassword.message"
                  prepend-inner-icon="mdi-lock"
                  :append-icon="showPassword.old ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword.old ? 'text' : 'password'"
                  :rules="[rules.required]"
                  dense
                  outlined
                  @click:append="showPassword.old = !showPassword.old"
                >
                  <template #label>
                    Mot de passe Actuel
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
                  :append-icon="
                    showPassword.current ? 'mdi-eye' : 'mdi-eye-off'
                  "
                  :type="showPassword.current ? 'text' : 'password'"
                  :rules="[rules.min, rules.strength]"
                  dense
                  outlined
                  @click:append="showPassword.current = !showPassword.current"
                >
                  <template #label> Nouveau Mot de passe </template>
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
                  type="password"
                >
                  <template #label>
                    Confirmer le nouveau mot de passe
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="8">
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
              <v-col cols="4">
                <create-role />
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
import zxcvbn from 'zxcvbn'
import CreateRole from '~/components/parametre/user-role/role/CreateRole.vue'
import {
  errorsWriting,
  errorsInitialise,
} from '~/components/helper/errorsHandle'

export default {
  components: {
    CreateRole,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    roles: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    dialogue: false,
    showPassword: {
      old: false,
      current: false,
    },
    // canSave: false,
    utilisateur: {
      name: '',
      email: '',
      oldPassword: '',
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
      oldPassword: { exist: false, message: null },
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
  // watch: {
  //   'utilisateur.password_confirmation'(password) {
  //     if (this.utilisateur.password.length > 0) {
  //       this.canSave = password === this.utilisateur.password
  //     }
  //   },
  // },
  mounted() {
    this.utilisateur = { ...this.item, password: '', password_confirmation: '' }
  },
  methods: {
    ...mapActions({ modifier: 'user/modifier' }),
    reinitialise() {
      this.dialogue = false
      errorsInitialise(this.errors)
      this.utilisateur = {
        ...this.item,
        oldPassword: '',
        password: '',
        password_confirmation: '',
      }
    },
    save() {
      this.modifier({
        ...this.utilisateur,
        id: this.item.id,
        user: this.user.id,
      })
        .then((result) => {
          this.$notifier.show({
            text: result.message,
            variant: 'success',
          })
          this.reinitialise()
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
