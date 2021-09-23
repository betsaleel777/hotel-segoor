<template>
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
      <show-reservation v-if="item.status !== 'reservée'" :item="item" />
      <edit-reservation
        v-if="item.status === 'reservée'"
        :item="item"
        :hebergements="hebergements"
        :chambres="chambres"
        :clients="clients"
      />
      <free-reservation v-if="item.status === 'reservée'" :item="item" />
      <delete-reservation :item="item" />
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import FreeReservation from '~/components/reception/reservation/FreeReservation'
import DeleteReservation from '~/components/reception/reservation/DeleteReservation'
import CreateReservation from '~/components/reception/reservation/CreateReservation.vue'
import EditReservation from '~/components/reception/reservation/EditReservation.vue'
import ShowReservation from '~/components/reception/reservation/ShowReservation.vue'

export default {
  components: {
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
    this.getReserved()
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
      getReserved: 'reception/reservation/getReserved',
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
