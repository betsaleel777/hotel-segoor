<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Approvisionements
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-externe :restaurant="restaurant" />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-data-table
                no-data-text="Aucune dépense"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="founds"
                :items-per-page="10"
              >
                <template #[`top`]>
                  <v-toolbar flat>
                    <create-depense
                      v-can="permissions.create"
                      :articles="articles"
                      :restaurant="restaurant"
                      @new-depense="update"
                    />
                    <v-btn
                      class="ml-2 mr-2"
                      :disabled="depenses.length === 0"
                      dark
                      color="primary"
                      @click="print"
                    >
                      <v-icon left>mdi-printer</v-icon>
                      IMPRIMER
                    </v-btn>
                    <dialog-date-picker
                      v-model="days"
                      label="Intervalle de jour"
                      :range="true"
                    />
                    <dialog-date-picker
                      v-model="day"
                      label="Pour un jour"
                      :range="false"
                    />
                    <v-spacer></v-spacer>
                  </v-toolbar>
                </template>
                <template #[`item.montant`]="{ item }">
                  {{ item.montant | formater }}
                </template>
                <template #[`item.jour`]="{ item }">
                  {{ $moment(item.jour).format('ll') }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <v-btn
                    elevation="1"
                    color="pink"
                    icon
                    fab
                    dark
                    x-small
                    :to="`/externe/${restaurant}/depense/${item.jour}/`"
                  >
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </template>
                <template #[`footer`]>
                  <div v-if="displayFooter">
                    <v-divider></v-divider>
                    <center>
                      <div class="pt-1 pb-1">
                        <v-btn color="indigo" text
                          ><v-icon left>mdi-cash</v-icon>Total:
                          {{ total | formater }}</v-btn
                        >
                      </div>
                    </center>
                  </div>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions></v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import printjs from 'print-js'
import { mapGetters } from 'vuex'
import { DepenseExterne } from '~/helper/permissions'
import SideExterne from '~/components/externe/SideExterne.vue'
import CreateDepense from '~/components/externe/depense/CreateDepenseExterne.vue'
import DialogDatePicker from '~/components/externe/DialogDatePicker.vue'
const moment = extendMoment(Moment)
export default {
  components: {
    SideExterne,
    CreateDepense,
    DialogDatePicker,
  },
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  data() {
    return {
      days: [],
      day: '',
      founds: [],
      displayFooter: false,
      permissions: {
        create: DepenseExterne.creation,
      },
      headers: [
        { text: 'Date', value: 'jour' },
        { text: 'Montant', value: 'montant' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    const { params, store } = this.$nuxt.context
    this.restaurant = Number(params.restaurant)
    await store.dispatch('externe/depense/getCompactees', params.restaurant)
    await store.dispatch('externe/article/getAll', params.restaurant)
    this.founds = this.depenses
  },
  computed: {
    ...mapGetters({
      articles: 'externe/article/articles',
      depenses: 'externe/depense/depensesDatesCompactees',
    }),
    total() {
      let sum = 0
      this.founds.forEach((depense) => {
        sum += Number(depense.montant)
      })
      return sum
    },
  },
  watch: {
    days(value) {
      this.filtrer(value)
    },
    day(value) {
      this.filtrer(value, false)
    },
  },
  methods: {
    print() {
      printjs({
        printable: this.founds,
        properties: [
          { field: 'jour', displayName: 'Date' },
          { field: 'montant', displayName: 'Montant total' },
        ],
        type: 'json',
        header: `<center><h3>Liste des achats de marchandises</h3>${this.$moment().format(
          'll'
        )}</center><br>`,
        css: [
          'https://cdnjs.cloudflare.com/ajax/libs/vuetify/3.0.0-alpha.11/vuetify.min.css',
        ],
        style: 'td {text-align: center }',
      })
    },
    filtrer(value, interval = true) {
      if (value.length > 0) {
        const search = interval ? moment.range(value) : this.$moment(value)
        this.founds = this.depenses.filter((depense) => {
          return interval
            ? search.contains(this.$moment(depense.jour))
            : search.isSame(this.$moment(depense.jour), 'days')
        })
        this.displayFooter = true
      } else {
        this.founds = this.depenses
        this.displayFooter = false
      }
    },
    update() {
      location.reload()
    },
  },
}
</script>

<style></style>
