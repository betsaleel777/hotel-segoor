<template>
  <v-data-table
    no-data-text="Aucune reception"
    :loading="loading"
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
          class="ml-2"
          :disabled="reservations.length === 0"
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
      <div class="text-truncate">
        {{ item.client_linked.nom | upper }}
        {{ item.client_linked.prenom | upper }}
      </div>
    </template>
    <template #[`item.status`]="{ item }">
      <v-chip small outlined :color="getColor(item.status)" dark>
        <span v-if="item.status === 'terminée'">attribuée</span>
        <span v-else>{{ item.status }}</span>
      </v-chip>
    </template>
    <template #[`item.montant`]="{ item }">
      {{ item.montant | formater }}
    </template>
    <template #[`item.verse`]="{ item }">
      {{ item.verse | formater }}
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
        v-if="item.status === 'reservée' || item.status === 'par site'"
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
import printjs from 'print-js'
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
  filters: {
    upper(value) {
      if (!value) return ''
      return value.toUpperCase()
    },
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  data() {
    return {
      search: '',
      loading: false,
      headers: [
        { text: 'Client', value: 'fullname', sortable: false },
        { text: 'Chambre', value: 'chambre_linked?.nom', sortable: false },
        { text: 'Debut', value: 'entree' },
        { text: 'Fin', value: 'sortie' },
        { text: 'statut', value: 'status' },
        { text: 'Montant chambre', value: 'montant', align: 'center' },
        { text: 'Total versé', value: 'verse', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  computed: {
    ...mapGetters('reception/reservation', ['reservations']),
    ...mapGetters('reception/client', ['clients']),
    ...mapGetters('parametre/chambre', ['chambres']),
    ...mapGetters('reception/reservation', ['hebergements']),
  },
  async mounted() {
    this.loading = true
    await this.getReserved()
    await this.getClients()
    await this.getChambres()
    await this.getHebergements()
    this.loading = false
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
    print() {
      const reservations = this.reservations.map((reservation) => {
        return {
          clients:
            reservation.client_linked.nom.toUpperCase() +
            ' ' +
            reservation.client_linked.prenom.toUpperCase(),
          chambres: reservation.chambre_linked.nom,
          entree: this.$moment(reservation.entree).format('ll'),
          sortie: this.$moment(reservation.sortie).format('ll'),
        }
      })
      printjs({
        printable: reservations,
        properties: ['clients', 'chambres', 'entree', 'sortie'],
        type: 'json',
        header: `<center><h3>Liste des reservations</h3>${this.$moment().format(
          'll'
        )}</center><br>`,
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
