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
              <side-stock />
            </v-col>
            <v-col cols="9">
              <v-data-table
                no-data-text="Aucun achat"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="founds"
                :items-per-page="10"
              >
                <template #[`top`]>
                  <v-toolbar flat>
                    <create-achat
                      v-can="permissions.create"
                      :floating="false"
                      :produits="produits"
                      @new-achat="update"
                    />
                    <v-btn
                      class="ml-2 mr-2"
                      :disabled="achats.length === 0"
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
                <template #[`item.created_at`]="{ item }">
                  {{ $moment(item.created_at).format('ll') }}
                </template>
                <template #[`item.montant`]="{ item }">
                  {{ item.montant | formater }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <v-btn
                    elevation="1"
                    color="pink"
                    icon
                    fab
                    dark
                    x-small
                    :to="`/stock/achat/${$moment(item.created_at).format(
                      'YYYY-MM-DD'
                    )}/`"
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
        <v-card-actions> </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import printjs from 'print-js'
import { mapGetters, mapActions } from 'vuex'
import DialogDatePicker from '~/components/externe/DialogDatePicker.vue'
import CreateAchat from '~/components/stock/achat/CreateAchat.vue'
import { StockAchats } from '~/helper/permissions'
import SideStock from '~/components/stock/SideStock'
const moment = extendMoment(Moment)
export default {
  components: {
    SideStock,
    CreateAchat,
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
        create: StockAchats.creation,
      },
      headers: [
        { text: 'Date', value: 'created_at' },
        { text: 'Montant', value: 'montant' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    await this.getProduits()
    await this.getCompactees()
    this.founds = this.achats
  },
  computed: {
    ...mapGetters({
      achats: 'stock/achat/achatsDatesCompactees',
      produits: 'produit/produits',
    }),
    total() {
      let sum = 0
      this.founds.forEach((achat) => {
        sum += Number(achat.montant)
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
    ...mapActions({
      getCompactees: 'stock/achat/getCompactees',
      getProduits: 'produit/getProduits',
    }),
    print() {
      printjs({
        printable: this.founds,
        properties: [
          { field: 'created_at', displayName: 'Date' },
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
        this.founds = this.achats.filter((achat) => {
          return interval
            ? search.contains(this.$moment(achat.created_at))
            : search.isSame(this.$moment(achat.created_at), 'days')
        })
        this.displayFooter = true
      } else {
        this.founds = this.achats
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
