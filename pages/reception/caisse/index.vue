<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Caisse
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-reception />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-data-table
                no-data-text="Aucune Donnée"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="encaissements"
                :search="search"
                :items-per-page="10"
              >
                <template #[`top`]>
                  <v-toolbar flat>
                    <create-versement
                      :attributions="attributions"
                      :reservations="reservations"
                      :floating="false"
                      @new-encaissement="pushEncaissement"
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
                  <v-chip outlined small :color="getColor(item.status)" dark>
                    {{ item.status }}
                  </v-chip>
                </template>
                <template #[`item.actions`]="{ item }">
                  <show-versement :item="item" />
                  <!-- <complete-versement :item="item" /> -->
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <create-versement
            :attributions="attributions"
            :reservations="reservations"
            @new-encaissement="pushEncaissement"
          />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import CreateVersement from '~/components/reception/caisse/CreateVersement.vue'
import ShowVersement from '~/components/reception/caisse/ShowVersement.vue'
import SideReception from '~/components/reception/SideReception.vue'

export default {
  components: {
    CreateVersement,
    ShowVersement,
    SideReception,
  },
  data() {
    return {
      search: '',
      encaissements: [],
      attributions: [],
      reservations: [],
      headers: [
        { text: 'Code', value: 'code', sortable: false },
        { text: 'Statut', value: 'status', sortable: false },
        { text: 'Date', value: 'created_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    let requete = await this.$axios.get('reception/encaissements')
    // console.log(requete.data.encaissements)
    // const encaissementsCollection = collect(requete.data.encaissements)
    this.encaissements = requete.data.encaissements.map((encaissement) => {
      const {
        attribution_linked: attribution,
        reservation_linked: reservation,
      } = encaissement
      return {
        id: encaissement.id,
        code: encaissement.code,
        versements: encaissement.versements,
        created_at: this.$moment(encaissement.created_at).format('ll'),
        status: encaissement.status,
        reservation,
        attribution,
      }
    })
    requete = await this.$axios.get('reception/attributions')
    let donneesFiltrees = requete.data.attributions.filter(
      (attribution) => attribution.status === 'occupée'
    )
    this.attributions = donneesFiltrees.map((attribution) => {
      return {
        id: attribution.id,
        nom: `Chambre ${attribution.chambre_linked.nom} ${attribution.client_linked.nom} ${attribution.client_linked.contact}`,
        prix: attribution.chambre_linked.prix_list[0].montant,
        remise: attribution.remise,
      }
    })
    requete = await this.$axios.get('reception/reservations')
    donneesFiltrees = requete.data.reservations.filter(
      (attribution) => attribution.status === 'reservée'
    )
    this.reservations = requete.data.reservations.map((reservation) => {
      return {
        id: reservation.id,
        nom: `Chambre ${reservation.chambre_linked.nom} ${reservation.client_linked.nom}`,
        prix: reservation.chambre_linked.prix_list[0].montant,
      }
    })
  },
  methods: {
    getColor(status) {
      if (status === 'soldée') {
        return 'green'
      } else if (status === 'en cours') {
        return 'blue'
      } else {
        return 'red'
      }
    },
    pushEncaissement(encaissement) {
      encaissement.created_at = this.$moment(encaissement.created_at).format(
        'll'
      )
      this.encaissements.push(encaissement)
    },
    encaissementEdited(encaissement) {
      encaissement.created_at = this.$moment(encaissement.created_at).format(
        'll'
      )
      const index = this.encaissements.findIndex(
        (element) => element.id === encaissement.id
      )
      this.encaissements.splice(index, 1, encaissement)
    },
    encaissementDeleted(encaissement) {
      encaissement.created_at = this.$moment(encaissement.created_at).format(
        'll'
      )
      this.encaissements = this.encaissements.filter(
        (element) => element.id !== encaissement.id
      )
    },
  },
}
</script>

<style></style>
