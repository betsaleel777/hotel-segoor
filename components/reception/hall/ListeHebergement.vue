<template>
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
      <!-- <show-reception
                    v-if="item.status !== 'libérée'"
                    :item="item"
                  /> -->
      <edit-attribution-form
        v-if="item.status !== 'libérée'"
        :item="item"
        :hebergements="hebergements"
        :chambres="chambres"
        :clients="clients"
      />
      <free-attribution v-if="item.status !== 'libérée'" :item="item" />
      <paiement-reception
        v-if="item.status !== 'libérée'"
        :reception="item"
        :moyens="moyens"
      />
      <delete-attribution-form :item="item" />
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import FreeAttribution from '~/components/reception/hall/FreeReception'
import DeleteAttributionForm from '~/components/reception/hall/DeleteReception'
import EditAttributionForm from '~/components/reception/hall/EditReception'
import CreateReception from '~/components/reception/hall/CreateReception.vue'
import PaiementReception from '~/components/reception/hall/PaiementReception.vue'
export default {
  components: {
    DeleteAttributionForm,
    EditAttributionForm,
    FreeAttribution,
    CreateReception,
    PaiementReception,
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
    this.getMoyens()
  },
  computed: {
    ...mapGetters('reception/attribution', ['attributions']),
    ...mapGetters('reception/client', ['clients']),
    ...mapGetters('parametre/chambre', ['chambres']),
    ...mapGetters('reception/reservation', ['hebergements']),
    ...mapGetters('moyen', ['moyens']),
  },
  methods: {
    ...mapActions({
      getAttributions: 'reception/attribution/getAll',
      getClients: 'reception/client/getAll',
      getChambres: 'parametre/chambre/getAll',
      getHebergements: 'reception/reservation/getHebergements',
      getMoyens: 'moyen/getAll',
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
