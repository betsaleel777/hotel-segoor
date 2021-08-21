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
                    <v-btn dark color="primary" nuxt to="/reception">
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
                <template #[`item.actions`]="{ item }">
                  <edit-attribution-form
                    :clients="clients"
                    :item="item"
                    @edited-attribution="attributionEdited"
                  />
                  <!-- <delete-attribution-form
                    :item="item"
                    @deleted-attribution="attributionDeleted"
                  />-->
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
        <v-card-actions> </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import FreeAttribution from '~/components/reception/hall/FreeReception'
import SideReception from '~/components/reception/SideReception.vue'
import DeleteAttributionForm from '~/components/reception/hall/DeleteReception'
import EditAttributionForm from '~/components/reception/hall/EditReception'
// import { checkReservationDate } from '~/components/helper/checkUtils'
export default {
  components: {
    SideReception,
    // eslint-disable-next-line vue/no-unused-components
    DeleteAttributionForm,
    EditAttributionForm,
    FreeAttribution,
  },
  data() {
    return {
      search: '',
      clients: [],
      attributions: [],
      // reservations: [],
      chambres: [],
      headers: [
        { text: 'Client', value: 'client.nom', sortable: false },
        { text: 'Chambre', value: 'chambre.nom', sortable: false },
        { text: 'Debut', value: 'entreeDisplay' },
        { text: 'Fin', value: 'sortieDisplay' },
        { text: 'status', value: 'status' },
        // { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    let requete = await this.$axios.get('reception/clients')
    const clients = requete.data.clients
    requete = await this.$axios.get('reception/attributions')
    const attributions = requete.data.attributions.map((attribution) => {
      return {
        id: attribution.id,
        code: attribution.code,
        status: attribution.status,
        chambre: {
          id: attribution.chambre_linked.id,
          nom: attribution.chambre_linked.nom,
        },
        client: {
          id: attribution.client_linked.id,
          nom: attribution.client_linked.nom,
        },
        entreeDisplay: this.$moment(attribution.entree).format('ll'),
        sortieDisplay: this.$moment(attribution.sortie).format('ll'),
        entree: attribution.entree,
        sortie: attribution.sortie,
      }
    })
    // requete = await this.$axios.get('reception/reservations/reserved')
    // console.log(requete.data.reservations)
    // let reservations = requete.data.reservations.map((reservation) => {
    //   const { id, code, entree, sortie } = reservation
    //   return { id, nom: code, entree, sortie }
    // })
    // reservations = checkReservationDate(reservations)
    requete = await this.$axios.get('gestion-chambre/chambres/passage')
    const chambres = requete.data.chambres
    this.clients = clients
    this.attributions = attributions
    // this.reservations = reservations
    this.chambres = chambres
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
      attribution.entreeDisplay = this.$moment(attribution.entree).format('ll')
      attribution.sortieDisplay = this.$moment(attribution.sortie).format('ll')
      this.attributions.push(attribution)
    },
    attributionEdited(attribution) {
      attribution.entreeDisplay = this.$moment(attribution.entree).format('ll')
      attribution.sortieDisplay = this.$moment(attribution.sortie).format('ll')
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
