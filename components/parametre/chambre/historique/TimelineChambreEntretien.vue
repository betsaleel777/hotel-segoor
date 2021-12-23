<template>
  <div>
    <v-timeline v-if="entretiens.length > 0" dense>
      <v-timeline-item v-for="(entretien, index) in entretiens" :key="index">
        <v-card class="elevation-2">
          <v-card-title class="subtitle-2 text-uppercase d-flex">
            <span
              >{{ entretien.employe.nom }} {{ entretien.employe.prenom }}</span
            >
            <span class="ml-auto">
              <v-rating
                :value="parseFloat(entretien.note.valeur)"
                color="yellow darken-3"
                background-color="grey darken-1"
                empty-icon="mdi-star-outline"
                full-icon="mdi-star"
                half-icon="mdi-star-half"
                readonly
              ></v-rating>
            </span>
          </v-card-title>
          <v-card-text v-html="entretien.description"></v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <span
              >le {{ $moment(entretien.entree).format('DD-MM-YYYY') + ' ' }}
            </span>
            <span>
              de {{ $moment(entretien.entree).format('HH:mm') }} à
              {{ $moment(entretien.sortie).format('HH:mm') }}
            </span>
          </v-card-actions>
        </v-card>
      </v-timeline-item>
    </v-timeline>
    <v-alert v-else text outlined color="deep-orange" icon="mdi-delete-empty">
    </v-alert>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  inject: ['id'],
  computed: {
    ...mapGetters('maintenance/entretien', ['entretiens']),
  },
  created() {
    this.getByRoom(this.id)
  },
  methods: {
    ...mapActions('maintenance/entretien', ['getByRoom']),
  },
}
</script>
<style></style>
