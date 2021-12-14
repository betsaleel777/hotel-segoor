<template>
  <v-data-table
    no-data-text="Aucune dépense de réparation"
    :loading="$fetchState.pending"
    loading-text="En chargement ..."
    :headers="headers"
    :items="repairs"
    :search="search"
    :items-per-page="10"
    ><template #[`top`]>
      <v-toolbar flat>
        <v-btn
          class="ml-2"
          :disabled="repairs.length === 0"
          color="primary"
          dark
          @click="print"
        >
          <v-icon left>mdi-printer</v-icon>
          IMPRIMER
        </v-btn>
        <v-dialog
          ref="dialog"
          v-model="modal"
          :return-value.sync="dates"
          persistent
          width="300px"
        >
          <template #activator="{ on, attrs }">
            <v-btn class="mx-2" color="primary" dark v-bind="attrs" v-on="on">
              <v-icon left>mdi-calendar-search</v-icon>
              filtrer par date
            </v-btn>
          </template>
          <v-date-picker
            v-model="dates"
            locale="fr"
            range
            color="primary darken-3"
          >
            <v-spacer></v-spacer>
            <v-btn text color="error" @click="modal = false"> fermer </v-btn>
            <v-btn text color="primary" @click="datesSearch(dates)"> OK </v-btn>
          </v-date-picker>
        </v-dialog>
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
    <template #[`item.nom`]="{ item }">
      <span class="text-truncate">{{ item.nom }}</span>
    </template>
    <template #[`item.created_at`]="{ item }">
      {{ $moment(item.created_at).format('ll') }}
    </template>
    <template #[`item.montant`]="{ item }">
      {{ item.montant | formater }}
    </template>
    <template #[`item.actions`]="{ item }">
      <show-reparation :id="item.id" />
    </template>
  </v-data-table>
</template>

<script>
import printjs from 'print-js'
import { mapGetters, mapActions } from 'vuex'
import ShowReparation from './ShowReparation.vue'
export default {
  components: { ShowReparation },
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  data() {
    return {
      search: '',
      modal: false,
      dates: [],
      footerVisible: false,
      total: 0,
      headers: [
        { text: 'Titre', value: 'nom', align: 'left', width: '30%' },
        { text: 'Date', value: 'created_at', align: 'center' },
        { text: 'Chambre', value: 'nomChambre' },
        { text: 'Catégorie', value: 'nomCategorie', sortable: false },
        { text: 'Montant', value: 'montant', align: 'left' },
        { text: 'Actions', value: 'actions', align: 'right', sortable: false },
      ],
    }
  },
  fetch() {
    this.getRepairs()
  },
  computed: {
    ...mapGetters({ repairs: 'maintenance/reparation/repairs' }),
  },
  methods: {
    ...mapActions({
      getRepairs: 'maintenance/reparation/getAll',
      getByDates: 'maintenance/reparation/getByDates',
      getByDate: 'maintenance/reparation/getByDate',
    }),
    print() {
      const repairs = this.repairs.map((repair) => {
        const { created_at: time, ...rest } = repair
        return {
          ...rest,
          created_at: this.$moment(time).format('ll'),
        }
      })
      printjs({
        printable: repairs,
        properties: [
          { field: 'nom', displayName: 'Titre' },
          { field: 'created_at', displayName: 'Date' },
          { field: 'nomChambre', displayName: 'Chambre' },
          { field: 'nomCategorie', displayName: 'Catégorie' },
          { field: 'montant', displayName: 'Montant' },
        ],
        type: 'json',
        header: `<center><h3>réparations</h3>${this.$moment().format(
          'll'
        )}</center><br>`,
        css: [
          'https://cdnjs.cloudflare.com/ajax/libs/vuetify/3.0.0-alpha.11/vuetify.min.css',
        ],
        style: 'td {text-align: center }',
      })
    },
    datesSearch(dates) {
      const total = (reparations) => {
        let somme = 0
        reparations.forEach((reparation) => (somme += reparation.montant))
        return somme
      }
      this.footerVisible = true
      if (dates.length === 2) {
        this.getByDates(this.dates).then(() => {
          this.total = total(this.repairs)
        })
      } else if (dates.length === 1) {
        this.getByDate(this.dates).then(() => {
          this.total = total(this.repairs)
        })
      } else {
        this.$notifier.show({
          text: 'Aucune date spécifiée',
          variant: 'warning',
        })
      }
    },
  },
}
</script>

<style></style>
