<template>
  <v-timeline dense>
    <v-timeline-item v-for="(hebergement, index) in attributions" :key="index">
      <v-card class="elevation-2">
        <v-card-title class="subtitle-2 text-uppercase d-flex">
          <span
            >{{ hebergement.client_linked.nom }}
            {{ hebergement.client_linked.prenom }}</span
          >
          <span class="ml-auto">{{ hebergement.total | formater }}</span>
        </v-card-title>
        <v-card-text>
          <div v-html="hebergement.description"></div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <span>
            du {{ $moment(hebergement.entree).format('ll') }} au
            {{ $moment(hebergement.sortie).format('ll') }}
          </span>
        </v-card-actions>
      </v-card>
    </v-timeline-item>
  </v-timeline>
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
    ...mapGetters('reception/attribution', ['attributions']),
  },
  created() {
    this.getByRoom(this.id).then(() => {
      console.log(this.attributions)
    })
  },
  methods: {
    ...mapActions('reception/attribution', ['getByRoom']),
  },
}
</script>
<style></style>
