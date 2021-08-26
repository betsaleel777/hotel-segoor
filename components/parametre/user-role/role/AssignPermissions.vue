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
            color="indigo"
            v-bind="attrs"
            v-on="{ ...tooltip, ...dialog }"
          >
            <v-icon small> mdi-clipboard-check </v-icon>
          </v-btn>
        </template>
        <span>assigner permissions</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Assigner un rôle</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-data-table
              no-data-text="Aucune permission"
              :loading="loading"
              loading-text="En chargement ..."
              :headers="headers"
              :items="permissions"
              :search="search"
              :items-per-page="20"
              locale="fr-FR"
            >
              <template #[`top`]>
                <v-toolbar flat>
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="recherche ..."
                    single-line
                    hide-details
                  ></v-text-field>
                </v-toolbar>
              </template>
              <template #[`item.selection`]="{ item }">
                <v-simple-checkbox
                  color="success"
                  :value="permissionsSelected.includes(item.id)"
                  @click="addPermission(item.id)"
                ></v-simple-checkbox>
              </template>
            </v-data-table>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="reinitialise"> Fermer </v-btn>
        <v-btn color="primary" text @click="save">Assigner </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  errorsWriting,
  errorsInitialise,
} from '~/components/helper/errorsHandle'

export default {
  props: {
    roleItem: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialogue: false,
    permissionsSelected: [],
    search: '',
    loading: null,
    headers: [
      { text: 'Selection', value: 'selection' },
      { text: 'Nom', value: 'name' },
    ],
    errors: {
      name: { exist: false, message: null },
    },
  }),
  computed: {
    ...mapGetters('role-permission/permission', ['permissions']),
  },
  mounted() {
    this.loading = true
    this.getAll().then(() => {
      this.loading = false
    })
    this.initialisationPermissions()
  },
  methods: {
    ...mapActions('role-permission/permission', ['assigner', 'getAll']),
    reinitialise() {
      this.dialogue = false
      errorsInitialise(this.errors)
      this.initialisationPermissions()
    },
    save() {
      this.assigner({
        id: this.roleItem.id,
        permissions: this.permissionsSelected,
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
    addPermission(id) {
      const index = this.permissionsSelected.findIndex(
        (element) => element === id
      )
      if (index === -1) {
        this.permissionsSelected.push(id)
      } else {
        this.permissionsSelected.splice(index, 1)
      }
    },
    initialisationPermissions() {
      this.permissionsSelected = this.roleItem.permissions.map((permission) => {
        return permission.id
      })
    },
  },
}
</script>

<style></style>
