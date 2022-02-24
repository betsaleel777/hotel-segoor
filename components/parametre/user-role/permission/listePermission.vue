<template>
  <v-container>
    <v-data-table
      no-data-text="Aucune permission"
      :loading="loading"
      loading-text="En chargement ..."
      :headers="headers"
      :items="permissions"
      :search="search"
      :items-per-page="10"
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
      <template #[`item.actions`]="{ item }">
        <edit-permission :item="item" />
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import EditPermission from './EditPermission.vue'
export default {
  components: {
    EditPermission,
  },
  props: {
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
