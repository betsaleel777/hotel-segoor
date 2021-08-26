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
        <create-user />
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
      <edit-user :item="item" />
      <delete-user :item="item" />
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CreateUser from './CreateUser.vue'
import DeleteUser from './DeleteUser.vue'
import EditUser from './EditUser.vue'
export default {
  components: {
    DeleteUser,
    EditUser,
    CreateUser,
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
  computed: {
    ...mapGetters('user', ['users']),
  },
  mounted() {
    this.loading = true
    this.getAll().then(() => {
      this.loading = false
    })
  },
  methods: {
    ...mapActions('user', ['getAll']),
  },
}
</script>

<style>
/* .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  font-size: 22px !important;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  font-size: 19px !important;
} */
</style>
