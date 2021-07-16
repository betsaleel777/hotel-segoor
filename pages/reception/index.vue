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
            <v-col justify="center" align="center" cols="12" sm="6" md="9">
              <FullCalendar :options="calendarOptions" />
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
          <create-reception :clients="clients" :infos="infos" />
          <create-reservation :clients="clients" :infos="infos" />
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
    />
  </v-row>
</template>

<script>
import moment from 'moment'
import FullCalendar from '@fullcalendar/vue'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import frLocale from '@fullcalendar/core/locales/fr'
import DetailsReception from './DetailsReception.vue'
import DetailsReservation from './DetailsReservation.vue'
import CreateReservation from '~/components/reception/dashboard/CreateReservation'
import CreateReception from '~/components/reception/dashboard/CreateReception'
import SideReception from '~/components/reception/SideReception.vue'

export default {
  components: {
    SideReception,
    FullCalendar,
    CreateReservation,
    CreateReception,
    DetailsReservation,
    DetailsReception,
  },
  data({ $axios }) {
    return {
      dialog: false,
      clients: [],
      events: [],
      infos: {},
      details: {},
      consommations: [],
      dialog1: false,
      dialog2: false,
      update: false,
      calendarOptions: {
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        locale: frLocale,
        plugins: [interactionPlugin, resourceTimelinePlugin, dayGridPlugin],
        initialView: 'resourceTimelineMonth',
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
              }
            })
            successCallback(events)
          })
        },
        eventOverlap(stillEvent, movingEvent) {
          this.overlapDetect(stillEvent, movingEvent)
        },
      },
    }
  },
  async mounted() {
    let calebasse = await this.$axios.get('reception/clients')
    const clients = calebasse.data.clients
    calebasse = await this.$axios.get('reception/reservations/events')
    const events = calebasse.data.events.map((event) => {
      return {
        id: event.id,
        resourceId: event.chambre,
        code: event.code,
        title: `${event.code} ${event.client_linked.nom}-${event.client_linked.contact}`,
        start: moment(event.entree).format('YYYY-MM-DD').toString(),
        end: moment(event.sortie).format('YYYY-MM-DD').toString(),
        reservation: event.reservation,
      }
    })
    this.events = events
    this.clients = clients
  },
  methods: {
    handleSelect(info) {
      const { coincide, code } = this.coincide(info)
      const end = moment(info.endStr).subtract(1, 'days')
      const start = moment(info.startStr)
      const endStr = end.format('YYYY-MM-DD').toString()
      if (end.diff(start, 'days') !== 0) {
        if (!coincide) {
          const { id, title } = info.resource
          this.infos = { id, title, sortie: endStr, entree: info.startStr }
          this.dialog = true
        } else {
          this.$toast.info(
            "coincidence de dates détectée avec l'hébergement: " + code + '.'
          )
        }
      }
    },
    handleResize(info) {
      console.log(info)
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
    overlapDetect(old, current) {
      console.log(old, current)
    },
    coincide({ endStr, startStr, resource }) {
      endStr = moment(endStr)
        .subtract(1, 'days')
        .format('YYYY-MM-DD')
        .toString()
      startStr = moment(endStr).add(1, 'days').format('YYYY-MM-DD').toString()
      const events = this.events.filter(
        (event) => event.resourceId === parseInt(resource.id)
      )
      let coincide = false
      let code = null
      if (events.length > 0) {
        for (const event of events) {
          coincide =
            (event.start <= startStr && startStr <= event.end) ||
            (event.start <= endStr && endStr <= event.end)
          if (coincide) {
            code = event.code
            break
          }
        }
        return { coincide, code }
      } else {
        return { coincide, code }
      }
    },
  },
}
</script>

<style></style>
