<template>
  <v-container fluid>
    <full-calendar ref="calendrier" :options="calendarOptions">
      <template #eventContent="{ event }">
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <div v-bind="attrs" class="text-truncate text-center" v-on="on">
              {{ event.title }}
            </div>
          </template>
          <span>Contact du client: {{ event.extendedProps.contact }}</span>
        </v-tooltip>
      </template>
    </full-calendar>
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
          <v-btn color="success" text @click="dialog4 = true">
            <v-icon left>mdi-location-enter</v-icon> attribuer
          </v-btn>
          <create-reception
            v-if="dialog4"
            v-model="dialog4"
            :infos="infos"
            @new-reception="newCalendarEvent"
          />
          <v-btn color="success" text @click="dialog5 = true">
            <v-icon left>mdi-shield-home-outline</v-icon> reserver
          </v-btn>
          <create-reservation
            v-if="dialog5"
            v-model="dialog5"
            :infos="infos"
            @new-reservation="newCalendarEvent"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <details-reception
      v-if="dialog1"
      v-model="dialog1"
      :details="details"
      @refresh="refresh"
    />
    <details-reservation
      v-if="dialog2"
      v-model="dialog2"
      :details="details"
      @refresh="refresh"
    />
    <edit-event
      v-model="dialog3"
      :item="evenement"
      @edit-closed="onEditEvent"
    />
  </v-container>
</template>

<script>
import moment from 'moment'
import FullCalendar from '@fullcalendar/vue'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import DetailsReception from '~/components/reception/dashboard/DetailsReception.vue'
import DetailsReservation from '~/components/reception/dashboard/DetailsReservation.vue'
import CreateReservation from '~/components/reception/dashboard/CreateReservationDialog.vue'
import CreateReception from '~/components/reception/dashboard/CreateReceptionDialog.vue'
import EditEvent from '~/components/reception/dashboard/EditEvent.vue'

export default {
  components: {
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
      events: [],
      evenement: {},
      infos: {},
      details: {},
      consommations: [],
      dialog1: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      dialog5: false,
      calendarOptions: {
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        locale: frLocale,
        plugins: [interactionPlugin, resourceTimelinePlugin],
        initialView: 'resourceTimelineMonth',
        resourceAreaWidth: '10%',
        headerToolbar: {
          left: 'today prev,next',
          center: 'title',
          right: 'resourceTimelineMonth,ressourceTimelineTwoMonth',
        },
        views: {
          ressourceTimelineTwoMonth: {
            type: 'resourceTimelineMonth',
            duration: { month: 2 },
            buttonText: 'Sur deux mois',
          },
        },
        height: 600,
        resourceAreaHeaderContent: 'CHAMBRES',
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
              const colorize = () => {
                if (event.status === 'occupée') {
                  return '#E53935'
                } else if (event.status === 'libérée') {
                  return '#66BB6A'
                } else if (event.status === 'annulée') {
                  return '#FFCA28'
                } else {
                  return '#1E88E5'
                }
              }
              return {
                id: event.id,
                resourceId: event.chambre,
                title: `${event.client_linked.nom.toUpperCase()} ${event.client_linked.prenom.toUpperCase()}`,
                start: moment(event.entree).format('YYYY-MM-DD').toString(),
                end: moment(event.sortie).format('YYYY-MM-DD').toString(),
                backgroundColor: colorize(),
                eventBorderColor: colorize(),
                // eventTextColor:
                extendedProps: {
                  status: event.status,
                  contact: event.client_linked.contact,
                },
                overlap: false,
                resourceEditable: false,
                startEditable: false,
                editable: true,
              }
            })
            successCallback(events)
          })
        },
      },
    }
  },
  mounted() {
    const calendar = this.$refs.calendrier.getApi()
    this.events = calendar.getEvents()
    this.$root.$on('update-calendar', () => {
      calendar.refetchEvents()
    })
  },
  methods: {
    handleSelect(info) {
      const { id, title } = info.resource
      this.infos = { id, title, sortie: info.endStr, entree: info.startStr }
      this.dialog = true
    },
    handleResize(info) {
      this.evenement = info.event
      const start = moment(info.event.start)
      const validation = moment().isAfter(start, 'days')
      if (validation) {
        this.$notifier.show({
          text: "Aucune modification n'est permise pour cette date.",
          variant: 'warning',
        })
        this.refresh()
      } else {
        this.dialog3 = true
      }
    },
    handleEventClick(info) {
      const status = info.event.extendedProps.status
      const objectPiece = {
        nature: null,
        numero_piece: null,
        delivre_le: null,
        expire_le: null,
        maker: null,
        lieu_piece: null,
        entree_pays: null,
      }
      if (status === 'occupée') {
        this.$axios
          .get('reception/attributions/' + info.event.id)
          .then((result) => {
            this.details = result.data.attribution
            if (this.details.client_linked.pieces.length > 0)
              this.details.client_linked.piece = this.details.client_linked.pieces[0]
            else this.details.client_linked.piece = objectPiece
            this.dialog1 = true
          })
      } else if (status === 'libérée') {
        this.$axios
          .get('reception/attributions/' + info.event.id)
          .then((result) => {
            this.details = result.data.attribution
            if (this.details.client_linked.pieces.length > 0)
              this.details.client_linked.piece = this.details.client_linked.pieces[0]
            else this.details.client_linked.piece = objectPiece
            this.dialog1 = true
          })
      } else {
        this.$axios
          .get('reception/reservations/' + info.event.id)
          .then((result) => {
            this.details = result.data.reservation
            if (this.details.client_linked.pieces.length > 0)
              this.details.client_linked.piece = this.details.client_linked.pieces[0]
            else this.details.client_linked.piece = objectPiece
            this.dialog2 = true
          })
      }
    },
    refresh() {
      this.$refs.calendrier.getApi().refetchEvents()
    },
    newCalendarEvent() {
      this.refresh()
      this.dialog = false
    },
    onEditEvent() {
      this.refresh()
      this.dialog3 = false
    },
  },
}
</script>

<style></style>
