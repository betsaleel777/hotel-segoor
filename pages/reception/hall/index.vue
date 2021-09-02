<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Reception
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-reception />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-data-table
                no-data-text="Aucune reception"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="attributions"
                :search="search"
                :items-per-page="10"
              >
                <template #[`top`]>
                  <v-toolbar flat>
                    <create-reception
                      :hebergements="hebergements"
                      :chambres="chambres"
                      :clients="clients"
                      :floating="false"
                    />
                    <v-btn
                      text
                      class="ml-2"
                      dark
                      color="primary"
                      nuxt
                      to="/reception"
                    >
                      <v-icon left>mdi-arrow-left</v-icon>
                      RETOUR
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
                <template #[`item.status`]="{ item }">
                  <v-chip small outlined :color="getColor(item.status)" dark>
                    {{ item.status }}
                  </v-chip>
                </template>
                <template #[`item.entree`]="{ item }">
                  {{ $moment(item.entree).format('ll') }}
                </template>
                <template #[`item.sortie`]="{ item }">
                  {{ $moment(item.sortie).format('ll') }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <edit-attribution-form
                    :item="item"
                    :hebergements="hebergements"
                    :chambres="chambres"
                    :clients="clients"
                  />
                  <free-attribution
                    v-if="item.status !== 'libérée'"
                    :item="item"
                  />
                  <delete-attribution-form :item="item" />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <create-reception
            :hebergements="hebergements"
            :chambres="chambres"
            :clients="clients"
            :floating="true"
          />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import FreeAttribution from '~/components/reception/hall/FreeReception'
import SideReception from '~/components/reception/SideReception.vue'
import DeleteAttributionForm from '~/components/reception/hall/DeleteReception'
import EditAttributionForm from '~/components/reception/hall/EditReception'
import CreateReception from '~/components/reception/hall/CreateReception.vue'
export default {
  components: {
    SideReception,
    DeleteAttributionForm,
    EditAttributionForm,
    FreeAttribution,
    CreateReception,
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Client', value: 'client_linked.nom', sortable: false },
        { text: 'Chambre', value: 'chambre_linked.nom', sortable: false },
        { text: 'Entrée', value: 'entree' },
        { text: 'Sortie', value: 'sortie' },
        { text: 'status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  fetch() {
    this.getHebergements()
    this.getClients()
    this.getChambres()
    this.getAttributions()
  },
  computed: {
    ...mapGetters('reception/attribution', ['attributions']),
    ...mapGetters('reception/client', ['clients']),
    ...mapGetters('parametre/chambre', ['chambres']),
    ...mapGetters('reception/reservation', ['hebergements']),
  },
  methods: {
    ...mapActions({
      getAttributions: 'reception/attribution/getAll',
      getClients: 'reception/client/getAll',
      getChambres: 'parametre/chambre/getAll',
      getHebergements: 'reception/reservation/getHebergements',
    }),
    getColor(status) {
      if (status === 'libérée') {
        return 'green'
      } else {
        return 'red'
      }
    },
  },
}
</script>

<style></style>
