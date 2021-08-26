<template>
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
      <edit-role :item="item" />
      <assign-permissions :role-item="item" />
      <delete-role :item="item" />
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
  computed: {
    ...mapGetters('role-permission/role', ['roles']),
  },
  mounted() {
    this.loading = true
    this.getAll().then(() => {
      this.loading = false
    })
  },
  methods: {
    ...mapActions('role-permission/role', ['getAll']),
  },
}
</script>

<style></style>
