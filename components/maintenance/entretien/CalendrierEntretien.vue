<template>
  <div class="mt-2">
    <v-sheet tile height="70" class="d-flex">
      <v-toolbar flat>
        <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <print-entretien :entretiens="events" />
        <create-entretien :employes="employes" :chambres="chambres" />
        <v-toolbar-title v-if="$refs.calendar">
          <span class="subtitle-1">{{ $refs.calendar.title }}</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu bottom right>
          <template #activator="{ on, attrs }">
            <v-btn
              small
              outlined
              color="grey darken-2"
              v-bind="attrs"
              v-on="on"
            >
              <span>{{ types[type] }}</span>
              <v-icon right> mdi-menu-down </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="type = 'month'">
              <v-list-item-title>Mois</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>Semaine</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>Jour</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-autocomplete
          v-model="searchChambre"
          single-line
          class="mt-1 mx-2"
          label="Chambres"
          :items="chambres"
          item-value="id"
          item-text="nom"
          dense
          append-outer-icon="mdi-magnify"
          color="indigo"
          item-color="indigo"
          @click:append-outer="rechercheChambre"
        ></v-autocomplete>
        <v-autocomplete
          v-model="searchEmploye"
          single-line
          class="mt-1 mx-2"
          label="Employés"
          :items="employes"
          item-value="id"
          item-text="fullname"
          dense
          append-outer-icon="mdi-magnify"
          color="indigo"
          item-color="indigo"
          @click:append-outer="rechercheEmploye"
        ></v-autocomplete>
        <v-spacer></v-spacer>
        <v-btn icon class="ma-2" @click="$refs.calendar.next()">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-toolbar>
    </v-sheet>
    <v-sheet height="600">
      <v-overlay :value="overlay" absolute>
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-calendar
        ref="calendar"
        v-model="focus"
        :type="type"
        :events="events"
        :event-color="getEventColor"
        locale="fr"
        :weekdays="weekday"
        color="primary darken-2"
        @click:event="showEvent"
        @click:more="viewDay"
        @click:date="viewDay"
        @change="getEvents"
      >
        <template #event="{ event }">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-chip
                label
                :color="event.color"
                v-bind="attrs"
                x-small
                class="pa-1 white--text"
                v-on="on"
              >
                <span class="text-truncate">{{ event.name }}</span>
              </v-chip>
            </template>
            <span>
              {{ event.name }}<br />le {{ $moment(event.start).format('ll') }},
              de
              {{ $moment(event.start).format('HH:mm') }}
              à {{ $moment(event.end).format('HH:mm') }}
            </span>
          </v-tooltip>
        </template>
      </v-calendar>
      <edit-entretien
        v-if="selectedOpen"
        v-model="selectedOpen"
        :item="selectedEvent"
      />
      <show-entretien
        v-if="shownOpen"
        v-model="shownOpen"
        :item="selectedEvent"
      />
    </v-sheet>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import PrintEntretien from './PrintEntretien.vue'
import ShowEntretien from './ShowEntretien.vue'
import CreateEntretien from '~/components/maintenance/entretien/CreateEntretien.vue'
import EditEntretien from '~/components/maintenance/entretien/EditEntretien.vue'
export default {
  components: { CreateEntretien, EditEntretien, PrintEntretien, ShowEntretien },
  data() {
    return {
      type: 'month',
      dialog: false,
      types: {
        month: 'Mois',
        week: 'Semaine',
        day: 'Jour',
      },
      focus: '',
      weekday: [1, 2, 3, 4, 5, 6, 0],
      selectedEvent: {},
      selectedOpen: false,
      shownOpen: false,
      searchChambre: null,
      searchEmploye: null,
      overlay: false,
    }
  },
  async fetch() {
    this.overlay = true
    await this.getEvents()
    await this.getEmployes()
    await this.getChambres()
    this.overlay = false
  },
  computed: {
    ...mapGetters({
      events: 'maintenance/entretien/events',
      employes: 'maintenance/employe/employes',
      chambres: 'parametre/chambre/chambres',
    }),
  },
  methods: {
    ...mapActions({
      getEvents: 'maintenance/entretien/getEvents',
      getEmployes: 'maintenance/employe/getAll',
      getChambres: 'parametre/chambre/getAll',
      getSearchEmployes: 'maintenance/entretien/getSearchEmployes',
      getSearchChambres: 'maintenance/entretien/getSearchChambres',
    }),
    getEventColor(event) {
      return event.color
    },
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        requestAnimationFrame(() =>
          requestAnimationFrame(() =>
            event.status !== 'complete'
              ? (this.selectedOpen = true)
              : (this.shownOpen = true)
          )
        )
      }
      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else if (this.shownOpen) {
        this.shownOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },
    rechercheChambre() {
      if (this.searchChambre) {
        this.getSearchChambres(this.searchChambre).then((result) => {
          this.$notifier.show({
            text: result.message,
            variant: 'info',
          })
          this.searchChambre = null
        })
      }
    },
    rechercheEmploye() {
      if (this.searchEmploye) {
        this.getSearchEmployes(this.searchEmploye).then((result) => {
          this.$notifier.show({
            text: result.message,
            variant: 'info',
          })
          this.searchEmploye = null
        })
      }
    },
  },
}
</script>
<style lang="scss"></style>
