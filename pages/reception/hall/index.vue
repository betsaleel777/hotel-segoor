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
                :items="attributions"
                :search="search"
                :items-per-page="10"
              >
                <template #[`item.status`]="{ item }">
                  <v-chip small outlined :color="getColor(item.status)" dark>
                    {{ item.status }}
                  </v-chip>
                </template>
                <template #[`item.actions`]="{ item }">
                  <edit-attribution-form
                    :clients="clients"
                    :item="item"
                    @edited-attribution="attributionEdited"
                  />
                  <delete-attribution-form
                    :item="item"
                    @deleted-attribution="attributionDeleted"
                  />
                  <free-attribution
                    v-if="item.status !== 'libérée'"
                    :item="item"
                    @free-attribution="attributionFree"
                  />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <create-reception
            :clients="clients"
            :chambres="chambres"
            :reservations="reservations"
            @new-attribution="pushAttribution"
          />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'
import FreeAttribution from '~/components/reception/hall/FreeReception'
import CreateReception from '~/components/reception/hall/CreateReception.vue'
import SideReception from '~/components/reception/SideReception.vue'
import DeleteAttributionForm from '~/components/reception/hall/DeleteReception'
import EditAttributionForm from '~/components/reception/hall/EditReception'
import { checkReservationDate } from '~/components/helper/checkUtils'
export default {
  components: {
    SideReception,
    CreateReception,
    DeleteAttributionForm,
    EditAttributionForm,
    FreeAttribution,
  },
  async asyncData({ $axios }) {
    moment.locale('fr')
    let calebasse = await $axios.get('reception/clients')
    const clients = calebasse.data.clients
    calebasse = await $axios.get('reception/attributions')
    const attributions = calebasse.data.attributions.map((attribution) => {
      // eslint-disable-next-line camelcase
      const { chambre_linked, client_linked, ...rest } = attribution
      const { code, id, entree, status, sortie } = rest
      return {
        id,
        code,
        status,
        chambre: { id: chambre_linked.id, nom: chambre_linked.nom },
        client: { id: client_linked.id, nom: client_linked.nom },
        entreeDisplay: moment(entree).format('ll'),
        sortieDisplay: moment(sortie).format('ll'),
        entree,
        sortie,
      }
    })
    calebasse = await $axios.get('reception/reservations/reserved')
    let reservations = calebasse.data.reservations.map((reservation) => {
      const { id, code, entree, sortie } = reservation
      return { id, nom: code, entree, sortie }
    })
    reservations = checkReservationDate(reservations)
    calebasse = await $axios.get('gestion-chambre/chambres/passage')
    const chambres = calebasse.data.chambres
    return { clients, attributions, reservations, chambres }
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Code', value: 'code', sortable: false },
        { text: 'Client', value: 'client.nom', sortable: false },
        { text: 'Chambre', value: 'chambre.nom', sortable: false },
        { text: 'Debut', value: 'entreeDisplay' },
        { text: 'Fin', value: 'sortieDisplay' },
        { text: 'status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  methods: {
    getColor(status) {
      if (status === 'libérée') {
        return 'green'
      } else {
        return 'red'
      }
    },
    pushAttribution(attribution) {
      moment().locale('fr')
      attribution.entreeDisplay = moment(attribution.entree).format('ll')
      attribution.sortieDisplay = moment(attribution.sortie).format('ll')
      this.attributions.push(attribution)
    },
    attributionEdited(attribution) {
      moment().locale('fr')
      attribution.entreeDisplay = moment(attribution.entree).format('ll')
      attribution.sortieDisplay = moment(attribution.sortie).format('ll')
      const index = this.attributions.findIndex(
        (element) => element.id === attribution.id
      )
      this.attributions.splice(index, 1, attribution)
    },
    attributionDeleted(attribution) {
      this.attributions = this.attributions.filter(
        (element) => element.id !== attribution.id
      )
    },
    attributionFree(attribution) {
      this.attributions.forEach((element) => {
        if (element.id === attribution.id) {
          element.status = 'libérée'
        }
      })
    },
  },
}
</script>

<style></style>
