<template>
  <v-dialog v-model="dialogue" persistent max-width="850px">
    <template #activator="{ on: dialog, attrs }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            :loading="loading"
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
    <v-card v-if="reparation">
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Détails de la Réparation</span>
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
                    >{{ reparation.nom }}</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Catégorie: </b
                    >{{ reparation.categorie.nom }}</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Chambre: </b
                    >{{ reparation.chambre.nom }}</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Coût total: </b
                    >{{ reparation.montant | formater }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="6"> </v-col>
          </v-row>
          <v-expansion-panels>
            <v-expansion-panel active-class="grey lighten-3">
              <v-expansion-panel-header color="blue darken-4">
                <span class="white--text">Ordres de réparations</span>
                <template #actions>
                  <v-icon color="white"> $expand </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <timeline-reparation :ordres="ordres" />
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
import TimelineReparation from './TimelineReparation.vue'
export default {
  components: { TimelineReparation },
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
    ordres: [],
    reparation: null,
    dialogue: false,
    loading: false,
  }),
  methods: {
    ...mapActions('maintenance/reparation', ['fetchOne']),
    getItem() {
      this.loading = true
      this.fetchOne(this.id).then((reparation) => {
        this.reparation = reparation
        this.ordres = reparation.ordres.sort((a, b) =>
          this.$moment(a.entree).isAfter(b.entree)
        )
        this.loading = false
      })
    },
  },
}
</script>

<style></style>
