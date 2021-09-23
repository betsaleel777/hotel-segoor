<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Clientelle
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-toolbar flat>
              <side-reception />
              <v-spacer></v-spacer>
              <v-btn text dark color="primary" nuxt to="/reception">
                <v-icon left>mdi-arrow-left</v-icon>
                Acceuil
              </v-btn>
            </v-toolbar>
            <v-col cols="12" sm="6" md="12">
              <v-data-table
                no-data-text="Aucun client"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="clients"
                :search="search"
                :items-per-page="10"
              >
                <template #[`top`]>
                  <v-toolbar flat>
                    <create-client :floating-button="false" />
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
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <create-client :floating-button="true" />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
/* eslint-disable camelcase */
import { mapActions, mapGetters } from 'vuex'
import SideReception from '~/components/reception/SideReceptionPrincipale.vue'
import EditClient from '~/components/reception/client/EditClientButton.vue'
import DeleteClient from '~/components/reception/client/DeleteClient.vue'
import CreateClient from '~/components/reception/client/CreateClientButton.vue'
import ShowClient from '~/components/reception/client/ShowClient.vue'

export default {
  components: {
    SideReception,
    EditClient,
    DeleteClient,
    CreateClient,
    ShowClient,
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Prenom', value: 'fullname' },
        { text: 'Contact', value: 'contact', sortable: false },
        { text: 'Dossier client', value: 'status', sortable: false },
        { text: 'Né le', value: 'naissance' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  fetch() {
    this.getAll()
  },
  computed: {
    ...mapGetters('reception/client', ['clients']),
  },
  methods: {
    ...mapActions('reception/client', ['getAll']),
    getColor(status) {
      return status === 'complet' ? 'green' : 'red'
    },
  },
}
</script>

<style></style>
