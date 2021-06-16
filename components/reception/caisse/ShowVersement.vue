<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ on }">
      <v-btn elevation="1" icon fab dark x-small color="pink" v-on="on">
        <v-icon small> mdi-eye </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="justify-center primary--text headline"
        ><div>Détail de versement</div>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <span
              ><b>Statut: </b
              ><span :class="statusColor">{{ item.status }}</span></span
            ><br />
            <span
              ><b>Client: </b>{{ client.nom }} {{ client.prenom }}</span
            > </v-col
          ><br />
          <v-divider vertical></v-divider>
          <v-col cols="6">
            <span><b>Chambre: </b>{{ chambre.nom }}</span
            ><br />
            <span><b>Accompagnants: </b>{{ objet.accompagnants }}</span
            ><br />
            <span
              ><b>Date d'entrée: </b
              >{{ $moment(objet.entree).format('ll') }}</span
            ><br />
            <span
              ><b>Date de sortie: </b
              >{{ $moment(objet.sortie).format('ll') }}</span
            ><br />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="11">
            <v-btn color="orange darken-4" text> Versements </v-btn>
          </v-col>
          <v-col cols="1">
            <v-btn v-if="versements.length > 4" icon @click="show = !show">
              <v-icon>{{
                show ? 'mdi-chevron-up' : 'mdi-chevron-down'
              }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-expand-transition>
          <div v-show="show">
            <v-divider></v-divider>
            <v-timeline align-top dense>
              <v-timeline-item
                v-for="(versement, index) in versements"
                :key="index"
                color="blue darken-4"
                small
              >
                <div>
                  <div class="font-weight-normal">
                    <strong>{{ versement.montant }} FCFA</strong> versé le
                    {{ $moment(versement.created_at).format('lll') }}
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </div>
        </v-expand-transition>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-4" text @click="closeShow">Cancel</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    versements: [],
    objet: {},
    chambre: {},
    client: {},
    show: false,
  }),
  computed: {
    statusColor() {
      if (this.item.status === 'soldée') {
        return 'success--text'
      } else if (this.item.status === 'en cours') {
        return 'primary--text'
      } else {
        return 'error--text'
      }
    },
  },
  mounted() {
    this.versements = this.item.versements
    const { reservation, attribution } = this.item
    reservation === null || reservation === undefined
      ? (this.objet = attribution)
      : (this.objet = reservation)
    this.chambre = this.objet.chambre_linked
    this.client = this.objet.client_linked
    this.versements.length > 4 ? (this.show = false) : (this.show = true)
  },
  methods: {
    closeShow() {
      this.dialog = false
    },
  },
}
</script>

<style></style>
