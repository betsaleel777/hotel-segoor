<template>
  <v-data-table
    no-data-text="Aucune Donnée"
    :loading="loading"
    loading-text="En chargement ..."
    :headers="headers"
    :items="founds"
    :items-per-page="10"
  >
    <template #[`top`]>
      <v-toolbar flat>
        <dialog-date-picker
          v-model="days"
          label="Intervalle de jour"
          :range="true"
        />
        <dialog-date-picker v-model="day" label="Pour un jour" :range="false" />
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>
    <template #[`item.jour`]="{ item }">
      {{ $moment(item.jour).format('ll') }}
    </template>
    <template #[`item.espece`]="{ item }">
      {{ item.espece | formater }}
    </template>
    <template #[`item.cheque`]="{ item }">
      {{ item.cheque | formater }}
    </template>
    <template #[`item.mobile`]="{ item }">
      {{ item.mobile | formater }}
    </template>
    <template #[`item.total`]="{ item }">
      {{ (item.espece + item.cheque + item.mobile) | formater }}
    </template>
    <template #[`item.actions`]="{ item }">
      <show-facture-soldee-externe :jour="item.jour" :restaurant="restaurant" />
    </template>
    <template #[`footer`]>
      <div v-if="displayFooter">
        <v-divider></v-divider>
        <div class="pt-1 pb-1">
          <v-btn color="indigo" text
            ><v-icon left>mdi-cash</v-icon>Total: {{ total | formater }}</v-btn
          >
        </div>
      </div>
    </template>
  </v-data-table>
</template>

<script>
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import printjs from 'print-js'
import DialogDatePicker from '../DialogDatePicker.vue'
import ShowFactureSoldeeExterne from './ShowFactureSoldeeExterne.vue'
const moment = extendMoment(Moment)

export default {
  components: { ShowFactureSoldeeExterne, DialogDatePicker },
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  props: {
    factures: {
      type: Array,
      required: true,
    },
    restaurant: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      days: [],
      day: '',
      founds: [],
      displayFooter: false,
      loading: false,
      headers: [
        { text: 'Date', value: 'jour', align: 'left', sortable: false },
        { text: 'Espèces', value: 'espece', align: 'center', sortable: false },
        { text: 'Cheque', value: 'cheque', align: 'center', sortable: false },
        { text: 'Mobile', value: 'mobile', align: 'center' },
        { text: 'Total', value: 'total', align: 'center' },
        { text: 'Actions', value: 'actions', align: 'right', sortable: false },
      ],
    }
  },
  computed: {
    total() {
      let sum = 0
      this.founds.forEach((facture) => {
        sum +=
          Number(facture.cheque) +
          Number(facture.espece) +
          Number(facture.mobile)
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
  mounted() {
    this.founds = this.factures
  },
  methods: {
    print() {
      const factures = this.founds.map((found) => {
        return {
          jour: found.jour,
          espece: found.espece,
          cheque: found.cheque,
          mobile: found.mobile,
          total:
            Number(found.espece) + Number(found.cheque) + Number(found.mobile),
        }
      })
      printjs({
        printable: factures,
        properties: [
          { field: 'jour', displayName: 'Date' },
          { field: 'total', displayName: 'Montant total' },
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
        this.founds = this.factures.filter((facture) => {
          return interval
            ? search.contains(this.$moment(facture.jour))
            : search.isSame(this.$moment(facture.jour), 'days')
        })
        this.displayFooter = true
      } else {
        this.founds = this.factures
        this.displayFooter = false
      }
    },
  },
}
</script>

<style></style>
