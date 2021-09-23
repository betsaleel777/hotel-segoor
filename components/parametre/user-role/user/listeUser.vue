<template>
  <v-data-table
    no-data-text="Aucun Utilisateurs"
    :loading="loading"
    loading-text="En chargement ..."
    :headers="headers"
    :items="users"
    :search="search"
    :items-per-page="10"
    locale="fr-FR"
  >
    <template #[`top`]>
      <v-toolbar flat>
        <create-user :roles="roles" />
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
    <template #[`item.status`]="{ item }">
      <v-chip v-if="item.status === 'connecté'" outlined color="success">{{
        item.status
      }}</v-chip>
      <v-chip v-else outlined color="error">{{ item.status }}</v-chip>
    </template>
    <template #[`item.actions`]="{ item }">
      <edit-user :item="item" :roles="roles" />
      <delete-user :item="item" />
    </template>
  </v-data-table>
</template>

<script>
import CreateUser from './CreateUser.vue'
import DeleteUser from './DeleteUser.vue'
import EditUser from './EditUser.vue'
export default {
  components: {
    DeleteUser,
    EditUser,
    CreateUser,
  },
  props: {
    roles: {
      type: Array,
      required: true,
    },
    users: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    search: '',
    loading: null,
    headers: [
      { text: 'Nom', value: 'name' },
      { text: 'Email', value: 'email' },
      { text: 'Status', value: 'status' },
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
