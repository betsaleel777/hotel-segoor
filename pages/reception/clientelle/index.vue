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
                    <create-client
                      :floating-button="false"
                      @new-client="pushClient"
                    />
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
                <!-- <template #[`item.status`]="{ item }">
                  <v-chip small outlined :color="getColor(item.status)" dark>
                    {{ item.status }}
                  </v-chip>
                </template> -->
                <template #[`item.actions`]="{ item }">
                  <edit-client :item="item" @edited-client="clientEdited" />
                  <delete-client :item="item" @deleted-client="clientDeleted" />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <create-client :floating-button="true" @new-client="pushClient" />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
/* eslint-disable camelcase */
import SideReception from '~/components/reception/SideReceptionPrincipale.vue'
import EditClient from '~/components/reception/client/EditClient.vue'
import DeleteClient from '~/components/reception/client/DeleteClient.vue'
import CreateClient from '~/components/reception/client/CreateClient.vue'

export default {
  components: {
    SideReception,
    EditClient,
    DeleteClient,
    CreateClient,
  },
  data() {
    return {
      search: '',
      clients: [],
      headers: [
        { text: 'Prenom', value: 'prenom' },
        { text: 'Contact', value: 'contact', sortable: false },
        { text: 'Pays', value: 'pays', sortable: false },
        { text: 'Domicile', value: 'domicile', sortable: false },
        { text: 'Né le', value: 'naissance' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    const calebasse = await this.$axios.get('reception/clients')
    const clients = calebasse.data.clients.map((client) => {
      const { pieces, ...rest } = client
      return {
        id: rest.id,
        code: rest.code,
        nom: rest.nom,
        prenom: rest.prenom,
        pere: rest.pere,
        mere: rest.mere,
        profession: rest.profession,
        email: rest.email,
        pays: rest.pays,
        domicile: rest.domicile,
        contact: rest.contact,
        naissance: rest.naissance,
        piece: pieces[0],
      }
    })
    this.clients = clients
  },
  methods: {
    pushClient(client) {
      this.clients.push(client)
    },
    clientEdited(client) {
      const index = this.clients.findIndex(
        (element) => element.id === client.id
      )
      this.clients.splice(index, 1, client)
    },
    clientDeleted(client) {
      this.clients = this.clients.filter((element) => element.id !== client.id)
    },
  },
}
</script>

<style></style>
