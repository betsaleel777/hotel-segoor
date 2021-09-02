<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Réservations
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
                :items="reservations"
                :search="search"
                :items-per-page="10"
              >
                <template #[`top`]>
                  <v-toolbar flat>
                    <create-reservation
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
                    <span v-if="item.status === 'terminée'">attribuée</span>
                    <span v-else>{{ item.status }}</span>
                  </v-chip>
                </template>
                <template #[`item.entree`]="{ item }">
                  {{ $moment(item.entree).format('ll') }}
                </template>
                <template #[`item.sortie`]="{ item }">
                  {{ $moment(item.sortie).format('ll') }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <show-reservation
                    v-if="item.status !== 'reservée'"
                    :item="item"
                  />
                  <edit-reservation
                    v-if="item.status === 'reservée'"
                    :item="item"
                    :hebergements="hebergements"
                    :chambres="chambres"
                    :clients="clients"
                  />
                  <free-reservation
                    v-if="item.status === 'reservée'"
                    :item="item"
                  />
                  <delete-reservation :item="item" />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <create-reservation
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
import FreeReservation from '~/components/reception/reservation/FreeReservation'
import DeleteReservation from '~/components/reception/reservation/DeleteReservation'
import SideReception from '~/components/reception/SideReception'
import CreateReservation from '~/components/reception/reservation/CreateReservation.vue'
import EditReservation from '~/components/reception/reservation/EditReservation.vue'
import ShowReservation from '~/components/reception/reservation/ShowReservation.vue'

export default {
  components: {
    SideReception,
    FreeReservation,
    DeleteReservation,
    CreateReservation,
    EditReservation,
    ShowReservation,
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Client', value: 'client_linked.nom', sortable: false },
        { text: 'Chambre', value: 'chambre_linked.nom', sortable: false },
        { text: 'Debut', value: 'entree' },
        { text: 'Fin', value: 'sortie' },
        { text: 'status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  fetch() {
    this.getReservations()
    this.getClients()
    this.getChambres()
    this.getHebergements()
  },
  computed: {
    ...mapGetters('reception/reservation', ['reservations']),
    ...mapGetters('reception/client', ['clients']),
    ...mapGetters('parametre/chambre', ['chambres']),
    ...mapGetters('reception/reservation', ['hebergements']),
  },
  methods: {
    ...mapActions({
      getReservations: 'reception/reservation/getAll',
      getClients: 'reception/client/getAll',
      getChambres: 'parametre/chambre/getAll',
      getHebergements: 'reception/reservation/getHebergements',
    }),
    getColor(status) {
      if (status === 'reservée') {
        return 'blue'
      } else if (status === 'terminée') {
        return 'black'
      } else {
        return 'pink'
      }
    },
  },
}
</script>

<style></style>
