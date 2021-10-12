<template>
  <v-data-table
    id="printable"
    no-data-text="Aucune reception"
    :loading="loading"
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
          class="ml-2"
          :disabled="attributions.length === 0"
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
      {{ item.client_linked.nom | upper }}
      {{ item.client_linked.prenom | upper }}
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
        @add-payed="paiementAdded"
      />
      <delete-attribution-form :item="item" />
    </template>
  </v-data-table>
</template>

<script>
import printjs from 'print-js'
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
        { text: 'Client', value: 'fullname', sortable: false },
        { text: 'Chambre', value: 'chambre_linked.nom', sortable: false },
        { text: 'Entrée', value: 'entree' },
        { text: 'Sortie', value: 'sortie' },
        { text: 'status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  computed: {
    ...mapGetters('reception/attribution', ['attributions']),
    ...mapGetters('reception/client', ['clients']),
    ...mapGetters('parametre/chambre', ['chambres']),
    ...mapGetters('reception/reservation', ['hebergements']),
    ...mapGetters('moyen', ['moyens']),
  },
  async mounted() {
    this.loading = true
    await this.getHebergements()
    await this.getClients()
    await this.getChambres()
    await this.getAttributions()
    await this.getMoyens()
    this.loading = false
    this.$root.$on('new-payement', () => {
      this.paiementAdded()
    })
  },
  methods: {
    ...mapActions({
      getAttributions: 'reception/attribution/getBusy',
      getClients: 'reception/client/getAll',
      getChambres: 'parametre/chambre/getAll',
      getHebergements: 'reception/reservation/getHebergements',
      getMoyens: 'moyen/getAll',
    }),
    paiementAdded() {
      this.getAttributions()
    },
    getColor(status) {
      if (status === 'libérée') {
        return 'green'
      } else {
        return 'red'
      }
    },
    print() {
      const attributions = this.attributions.map((attribution) => {
        return {
          clients:
            attribution.client_linked.nom.toUpperCase() +
            ' ' +
            attribution.client_linked.prenom.toUpperCase(),
          chambres: attribution.chambre_linked.nom,
          entree: this.$moment(attribution.entree).format('ll'),
          sortie: this.$moment(attribution.sortie).format('ll'),
        }
      })
      printjs({
        printable: attributions,
        properties: ['clients', 'chambres', 'entree', 'sortie'],
        type: 'json',
        header: `<center><h3>Liste des Chambres occupées</h3>${this.$moment().format(
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
