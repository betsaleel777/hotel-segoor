<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Acceuil gestion receptions
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-reception />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-toolbar class="elevation-0">
                <!-- <v-toolbar-title>Title</v-toolbar-title> -->
                <v-spacer></v-spacer>
                <v-btn color="indigo">
                  <v-icon left>mdi-cash-multiple</v-icon>Paiements
                </v-btn>
              </v-toolbar>
            </v-col>
            <v-col justify="center" align="center" cols="12" sm="6" md="12">
              <FullCalendar ref="calendrier" :options="calendarOptions" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions></v-card-actions>
      </v-card>
    </v-col>
    <v-dialog v-model="dialog" max-width="300">
      <v-card>
        <v-card-title class="headline">
          <h6>Choix du mode d'enregistrement</h6>
        </v-card-title>
        <v-card-text
          >Voulez-vous enregistrer une reservation ou attribuer une chambre à un
          client</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <create-reception
            :clients="clients"
            :infos="infos"
            @new-reception="refresh"
          />
          <create-reservation
            :clients="clients"
            :infos="infos"
            @new-reservation="refresh"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <details-reception
      v-if="Object.keys(details)"
      v-model="dialog1"
      :details="details"
    />
    <details-reservation
      v-if="Object.keys(details)"
      v-model="dialog2"
      :details="details"
      @refresh="refresh"
    />
    <edit-event v-model="dialog3" :item="event" @edit-closed="refresh" />
  </v-row>
</template>

<script>
import moment from 'moment'
import FullCalendar from '@fullcalendar/vue'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import DetailsReception from '~/components/reception/dashboard/DetailsReception.vue'
import DetailsReservation from '~/components/reception/dashboard/DetailsReservation.vue'
import CreateReservation from '~/components/reception/dashboard/CreateReservation'
import CreateReception from '~/components/reception/dashboard/CreateReception'
import SideReception from '~/components/reception/SideReception.vue'
import EditEvent from '~/components/reception/dashboard/EditEvent.vue'

export default {
  components: {
    SideReception,
    FullCalendar,
    CreateReservation,
    CreateReception,
    DetailsReservation,
    DetailsReception,
    EditEvent,
  },
  data({ $axios }) {
    return {
      dialog: false,
      clients: [],
      events: [],
      event: {},
      infos: {},
      details: {},
      consommations: [],
      dialog1: false,
      dialog2: false,
      dialog3: false,
      calendarOptions: {
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        locale: frLocale,
        plugins: [interactionPlugin, resourceTimelinePlugin],
        initialView: 'resourceTimelineMonth',
        resourceAreaWidth: '20%',
        headerToolbar: {
          left: 'today prev,next',
          center: 'title',
          right: 'resourceTimelineMonth',
        },
        editable: true,
        selectable: true,
        selectOverlap: false,
        nowIndicator: true,
        selectMirror: true,
        eventResourceEditable: false,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleSelect,
        eventClick: this.handleEventClick,
        eventResize: this.handleResize,
        resources(fetchInfo, successCallback, failureCallback) {
          $axios.get('gestion-chambre/chambres').then((result) => {
            const chambres = result.data.chambres.map((chambre) => {
              const { id, nom } = chambre
              return { id, title: nom.toUpperCase() }
            })
            successCallback(chambres)
          })
        },
        events(fetchInfo, successCallback, failureCallback) {
          $axios.get('reception/reservations/events').then((result) => {
            const events = result.data.events.map((event) => {
              return {
                id: event.id,
                resourceId: event.chambre,
                title: `${event.code} ${event.client_linked.nom}-${event.client_linked.contact}`,
                start: moment(event.entree).format('YYYY-MM-DD').toString(),
                end: moment(event.sortie).format('YYYY-MM-DD').toString(),
                backgroundColor:
                  event.reservation === null || event.attribution !== null
                    ? 'red'
                    : 'blue',
                // eventBorderColor:
                // eventTextColor:
                extendedProps: {
                  attribution: event.attribution,
                },
                overlap: false,
              }
            })
            successCallback(events)
          })
        },
      },
    }
  },
  async mounted() {
    const calebasse = await this.$axios.get('reception/clients')
    const clients = calebasse.data.clients
    const calendar = this.$refs.calendrier.getApi()
    this.events = calendar.getEvents()
    this.clients = clients
  },
  methods: {
    handleSelect(info) {
      const { id, title } = info.resource
      this.infos = { id, title, sortie: info.endStr, entree: info.startStr }
      this.dialog = true
    },
    handleResize(info) {
      this.event = info.event
      const now = moment()
      const start = moment(info.event.start)
      if (info.event.extendedProps.attribution) {
        // console.log('attribution conditions de validation')
      } else if (start.isSame(now) || start.isBefore(now)) {
        this.$notifier.show({
          text: 'Aucune reservation est permise pour cette date',
          variant: 'warning',
        })
        this.refresh()
      } else {
        this.dialog3 = true
      }
    },
    handleEventClick(info) {
      if (info.event.backgroundColor === 'red') {
        this.$axios
          .get('reception/attributions/' + info.event.id)
          .then((result) => {
            this.details = result.data.attribution
            this.dialog1 = true
          })
      } else if (info.event.backgroundColor === 'green') {
        this.$axios
          .get('reception/attributions/' + info.event.id)
          .then((result) => {
            this.details = result.data.attribution
            this.dialog1 = true
          })
        // desactiver le bouton faire payer
      } else {
        this.$axios
          .get('reception/reservations/' + info.event.id)
          .then((result) => {
            this.details = result.data.reservation
            this.dialog2 = true
          })
      }
    },
    refresh() {
      this.$refs.calendrier.getApi().refetchEvents()
    },
  },
}
</script>

<style></style>
