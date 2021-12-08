<template>
  <v-dialog v-model="dialogue" persistent max-width="850px">
    <template #activator="{ on: dialog, attrs }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            v-bind="attrs"
            color="pink"
            elevation="1"
            icon
            fab
            dark
            x-small
            v-on="{ ...tooltip, ...dialog }"
            @click="getItem"
          >
            <v-icon small>mdi-eye</v-icon>
          </v-btn>
        </template>
        <span>visualiser</span>
      </v-tooltip>
    </template>
    <v-card v-if="chambre">
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Détails de chambre</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="dialogue = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-list dense>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Nom: </b
                    >{{ chambre.nom }}</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Catégorie: </b
                    >{{ chambre.categorie_linked.nom }}</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Prix Actuel: </b
                    >{{ chambre.prix_vente | formater }} /
                    nuitée</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="6">
              <div class="d-flex justify-center ma-10">
                <v-alert
                  :type="colorize(chambre.status)"
                  prominent
                  dense
                  width="75%"
                  text
                >
                  <h2>{{ chambre.status }}</h2>
                </v-alert>
              </div>
            </v-col>
          </v-row>
          <v-expansion-panels v-model="panel" focusable multiple tile>
            <v-expansion-panel>
              <v-expansion-panel-header color="blue darken-4">
                <span class="white--text">Synthèse des prix</span>
                <template #actions>
                  <v-icon color="white"> $expand </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <Apexchart
                  type="line"
                  height="350"
                  :options="chartOptions"
                  :series="series"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header color="blue darken-4">
                <span class="white--text">Historique</span>
                <template #actions>
                  <v-icon color="white"> $expand </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                Historique de la chambre composant
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header color="blue darken-4">
                <span class="white--text">Etat Actuel</span>
                <template #actions>
                  <v-icon color="white"> $expand </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <etat-chambre
                  :id="id"
                  :key="key"
                  :etat="etat"
                  @new-state="dialogue = false"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="dialogue = false"> Fermer </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import EtatChambre from './EtatChambre.vue'
export default {
  components: { EtatChambre },
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    chambre: null,
    key: false,
    dialogue: false,
    panel: [2],
    etat: [],
    series: [
      {
        name: '',
        data: [],
      },
    ],
    xAxeData: [],
  }),
  computed: {
    chartOptions() {
      return {
        chart: {
          height: 200,
          type: 'line',
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
        },
        title: {
          text: 'Evolution du prix des articles',
          align: 'left',
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: this.xAxeData,
        },
      }
    },
  },
  methods: {
    ...mapActions('parametre/chambre', ['getOne']),
    getItem() {
      this.getOne(this.id).then((chambre) => {
        const { prix_list: prices, equipements, ...rest } = chambre
        this.chambre = rest
        this.etat = equipements.map((equipement) => {
          return {
            id: equipement.pivot.fourniture_id,
            nom: equipement.nom,
            libelle: equipement.pivot.libelle,
            quantite: equipement.pivot.quantite,
          }
        })
        this.key = !this.key
        this.xAxeData = prices.map((price) => {
          return this.$moment(price.created_at).format('LL').toString()
        })
        this.series[0].data = prices.map((price) => {
          return Number(price.montant)
        })
      })
    },
    colorize(status) {
      return status === 'occupée' ? 'error' : 'success'
    },
  },
}
</script>

<style></style>
