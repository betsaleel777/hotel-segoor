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
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="recherche ..."
                single-line
                hide-details
              ></v-text-field>
              <v-data-table
                no-data-text="Aucune reception"
                :headers="headers"
                :items="reservations"
                :search="search"
                :items-per-page="10"
              >
                <template #[`item.status`]="{ item }">
                  <v-chip small outlined :color="getColor(item.status)" dark>
                    {{ item.status }}
                  </v-chip>
                </template>
                <template #[`item.actions`]="{ item }">
                  <free-reservation
                    v-if="item.status === 'reservée'"
                    :item="item"
                    @free-reservation="reservationFree"
                  />
                  <delete-reservation
                    :item="item"
                    @deleted-reservation="reservationDeleted"
                  />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <!-- <create-reservation
            :clients="clients"
            @new-reservation="pushReservation"
          /> -->
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
/* eslint-disable camelcase */
import moment from 'moment'
import FreeReservation from '~/components/reception/reservation/FreeReservation'
import DeleteReservation from '~/components/reception/reservation/DeleteReservation'
import SideReception from '~/components/reception/SideReception'
// import CreateReservation from '~/components/reception/reservation/CreateReservation.vue'

export default {
  components: {
    SideReception,
    FreeReservation,
    DeleteReservation,
  },
  async asyncData({ $axios }) {
    moment.locale('fr')
    // let calebasse = await $axios.get('reception/clients')
    // const clients = calebasse.data.clients
    let calebasse = await $axios.get('reception/reservations')
    const reservations = calebasse.data.reservations.map((reservation) => {
      const { chambre_linked, client_linked, ...rest } = reservation
      return {
        id: rest.id,
        code: rest.code,
        status: rest.status,
        chambre: { id: chambre_linked.id, nom: chambre_linked.nom },
        client: { id: client_linked.id, nom: client_linked.nom },
        entree: moment(rest.entree).format('ll'),
        sortie: moment(rest.sortie).format('ll'),
      }
    })
    calebasse = await $axios.get('gestion-chambre/chambres/passage')
    const chambres = calebasse.data.chambres.map((chambre) => {
      return {
        id: chambre.id,
        nom: `libelle: ${chambre.nom} ---${chambre.prix_list[0].montant} FCFA`,
      }
    })
    return { reservations, chambres }
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Code', value: 'code', sortable: false },
        { text: 'Client', value: 'client.nom', sortable: false },
        { text: 'Chambre', value: 'chambre.nom', sortable: false },
        { text: 'Debut', value: 'entree' },
        { text: 'Fin', value: 'sortie' },
        { text: 'status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  methods: {
    getColor(status) {
      if (status === 'reservée') {
        return 'blue'
      } else {
        return 'pink'
      }
    },
    // pushReservation(reservation) {
    //   moment().locale('fr')
    //   reservation.entree = moment(reservation.entree).format('ll')
    //   reservation.sortie = moment(reservation.sortie).format('ll')
    //   this.reservations.push(reservation)
    // },
    // reservationEdited(reservation) {
    //   moment().locale('fr')
    //   reservation.entree = moment(reservation.entree).format('ll')
    //   reservation.sortie = moment(reservation.sortie).format('ll')
    //   const index = this.reservations.findIndex(
    //     (element) => element.id === reservation.id
    //   )
    //   this.reservations.splice(index, 1, reservation)
    // },
    reservationDeleted(reservation) {
      this.reservations = this.reservations.filter(
        (element) => element.id !== reservation.id
      )
    },
    reservationFree(reservation) {
      this.reservations.forEach((element) => {
        if (element.id === reservation.id) {
          element.status = 'annulée'
        }
      })
    },
  },
}
</script>

<style></style>
