/* eslint-disable object-shorthand */
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
        <v-card-actions> </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
/* eslint-disable camelcase */
import moment from 'moment'
import FullCalendar from '@fullcalendar/vue'
// import dayGridPlugin from '@fullcalendar/daygrid'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import SideReception from '~/components/reception/SideReception.vue'

export default {
  components: { SideReception, FullCalendar },
  data({ $axios }) {
    return {
      events: [],
      calendarOptions: {
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        locale: frLocale,
        plugins: [interactionPlugin, resourceTimelinePlugin],
        initialView: 'resourceTimelineMonth',
        headerToolbar: {
          left: 'today prev,next',
          center: 'title',
          right: 'resourceTimelineWeek,resourceTimelineMonth',
        },
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleSelect,
        eventClick: this.handleEventClick,
        // eventsSet: this.handleEvents
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
          $axios.get('reception/reservations').then((result) => {
            const events = result.data.reservations.map((reservation) => {
              return {
                id: reservation.id,
                resourceId: reservation.chambre,
                title: `${reservation.code} ${reservation.client_linked.nom}-${reservation.client_linked.contact}`,
                start: moment(reservation.entree)
                  .format('YYYY-MM-DD')
                  .toString(),
                end: moment(reservation.sortie).format('YYYY-MM-DD').toString(),
              }
            })
            successCallback(events)
          })
        },
      },
    }
  },
  methods: {
    handleSelect(info) {
      const end = moment(info.endStr).subtract(1, 'days')
      const start = moment(info.startStr)
      // this.delais = end.diff(start, 'days')
      if (end.diff(start, 'days') === 0) {
        const message = `le délais ainsi choisit ne nécessite pas l'enregistrement d'une réservation`
        this.$notifier.show({ text: message, variant: 'warning' })
      } else {
        // this.timeInterval.debut = start.format('YYYY-MM-DD').toString()
        // this.timeInterval.fin = end.format('YYYY-MM-DD').toString()
        // lancer ajouter reception
      }
    },
    handleEventClick(info) {
      // const { event } = info
    },
  },
}
</script>

<style></style>
