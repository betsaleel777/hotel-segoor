<template>
  <v-container>
    <v-data-table
      no-data-text="Aucun Rôle"
      :loading="loading"
      loading-text="En chargement ..."
      :headers="headers"
      :items="roles"
      :search="search"
      :items-per-page="10"
      locale="fr-FR"
    >
      <template #[`top`]>
        <v-toolbar flat>
          <create-role />
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="recherche ..."
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
      </template>
      <template #[`item.actions`]="{ item }">
        <edit-role v-if="item.name !== 'Super Admin'" :item="item" />
        <assign-permissions
          v-if="item.name !== 'Super Admin'"
          :role-item="item"
          :permissions="permissions"
        />
        <delete-role v-if="item.name !== 'Super Admin'" :item="item" />
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import AssignPermissions from './AssignPermissions.vue'
import CreateRole from './CreateRole.vue'
import DeleteRole from './DeleteRole.vue'
import EditRole from './EditRole.vue'
export default {
  components: {
    DeleteRole,
    EditRole,
    CreateRole,
    AssignPermissions,
  },
  props: {
    roles: {
      type: Array,
      required: true,
    },
    permissions: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    search: '',
    loading: null,
    headers: [
      { text: 'Nom', value: 'name' },
      {
        text: 'Actions',
        value: 'actions',
        sortable: false,
        width: '30%',
        align: 'center',
      },
    ],
  }),
}
</script>

<style></style>
