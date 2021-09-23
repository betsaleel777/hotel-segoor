<template>
  <v-dialog v-model="dialogue" persistent max-width="650px">
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
        <span class="headline primary--text"
          >Assigner des permissions au role {{ roleItem.name }}</span
        >
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
import { mapActions } from 'vuex'
export default {
  props: {
    roleItem: {
      type: Object,
      required: true,
    },
    permissions: {
      type: Array,
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
  mounted() {
    this.initialisationPermissions()
  },
  methods: {
    ...mapActions({
      assigner: 'role-permission/role/assigner',
      getRole: 'role-permission/role/getRole',
    }),
    reinitialise() {
      this.initialisationPermissions()
      this.dialogue = false
    },
    save() {
      this.assigner({
        id: this.roleItem.id,
        permissions: this.permissionsSelected,
      }).then((result) => {
        this.$notifier.show({
          text: result.message,
          variant: 'success',
        })
        this.getRole({ id: this.roleItem.id }).then((role) => {
          this.permissionsSelected = role.permissions.map((permission) => {
            return permission.id
          })
          this.dialogue = false
        })
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
