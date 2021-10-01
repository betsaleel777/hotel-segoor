<template>
  <v-data-table
    no-data-text="Aucun client"
    :loading="loading"
    loading-text="En chargement ..."
    :headers="headers"
    :items="clients"
    :search="search"
    :items-per-page="10"
  >
    <template #[`top`]>
      <v-toolbar flat>
        <create-client />
        <v-btn
          class="ml-2"
          :disabled="clients.length === 0"
          dark
          color="primary"
          @click="print"
        >
          <v-icon left>mdi-printer</v-icon>
          IMPRIMER
        </v-btn>
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
    <template #[`item.fullname`]="{ item }">
      {{ item.fullname | upper }}
    </template>
    <template #[`item.status`]="{ item }">
      <v-chip small outlined :color="getColor(item.status)" dark>
        {{ item.status }}
      </v-chip>
    </template>
    <template #[`item.actions`]="{ item }">
      <show-client :item="item" />
      <edit-client :item="item" />
      <delete-client :item="item" />
    </template>
  </v-data-table>
</template>

<script>
import printjs from 'print-js'
import { mapActions, mapGetters } from 'vuex'
import EditClient from '~/components/reception/client/EditClientButton.vue'
import DeleteClient from '~/components/reception/client/DeleteClient.vue'
import CreateClient from '~/components/reception/client/CreateClientButton.vue'
import ShowClient from '~/components/reception/client/ShowClient.vue'

export default {
  components: {
    EditClient,
    DeleteClient,
    CreateClient,
    ShowClient,
  },
  filters: {
    upper(value) {
      if (!value) return ''
      return value.toUpperCase()
    },
  },
  data() {
    return {
      search: '',
      loading: false,
      headers: [
        { text: 'Nom complet', value: 'fullname' },
        { text: 'Contact', value: 'contact', sortable: false },
        { text: 'Dossier client', value: 'status', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false, align: 'right' },
      ],
    }
  },
  computed: {
    ...mapGetters('reception/client', ['clients']),
  },
  mounted() {
    this.loading = true
    this.getAll().then(() => {
      this.loading = false
    })
  },
  methods: {
    ...mapActions('reception/client', ['getAll']),
    getColor(status) {
      return status === 'complet' ? 'green' : 'red'
    },
    print() {
      const clients = this.clients.map((client) => {
        return {
          fullname:
            client.nom.toUpperCase() + ' ' + client.prenom.toUpperCase(),
          telephone: client.contact ?? 'Non pourvu',
          email: client.email ?? 'Non pourvu',
          profession: client.profession ?? 'Non pourvu',
        }
      })
      printjs({
        printable: clients,
        properties: [
          { field: 'fullname', displayName: 'Nom complet' },
          { field: 'telephone', displayName: 'Téléphone' },
          { field: 'email', displayName: 'E-mail' },
          { field: 'profession', displayName: 'Profession' },
        ],
        type: 'json',
        header: '<center><h3>Liste des Clients</h3></center><br>',
        css: [
          'https://cdnjs.cloudflare.com/ajax/libs/vuetify/3.0.0-alpha.11/vuetify.min.css',
        ],
        style: 'td {text-align: center;font-size: small } ',
      })
    },
  },
}
</script>

<style></style>
