<template>
  <v-dialog v-model="dialogue" persistent max-width="600px">
    <template #activator="{ on: dialog, attrs }">
      <v-tooltip right>
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
        <span class="headline primary--text">Modifier permission</span>
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
                  v-model="permission.name"
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
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="reinitialise"> Fermer </v-btn>
        <v-btn color="primary" text @click="save">modifier </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import {
  errorsWriting,
  errorsInitialise,
} from '~/components/helper/errorsHandle'

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialogue: false,
    permission: {
      name: '',
    },
    errors: {
      name: { exist: false, message: null },
    },
  }),
  mounted() {
    this.permission.name = this.item.name
  },
  methods: {
    ...mapActions('role-permission/permission', ['modifier']),
    reinitialise() {
      this.dialogue = false
      errorsInitialise(this.errors)
      this.permission.name = this.item.name
    },
    save() {
      this.modifier({
        id: this.item.id,
        name: this.permission.name,
        user: this.user.id,
      })
        .then((result) => {
          this.$notifier.show({
            text: result.message,
            variant: 'success',
          })
          this.reinitialise()
          this.dialogue = false
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
