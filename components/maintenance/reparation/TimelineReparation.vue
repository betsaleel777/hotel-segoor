<template>
  <v-timeline dense>
    <v-timeline-item v-for="(ordre, index) in ordres" :key="index">
      <v-card class="elevation-2">
        <v-card-title class="subtitle-2 text-uppercase d-flex">
          <span>{{ ordre.provider.nom }} {{ ordre.provider.prenom }}</span>
          <span class="ml-auto">{{ ordre.montant | formater }}</span>
        </v-card-title>
        <v-card-text v-html="ordre.description"></v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <span>{{ $moment(ordre.entree).format('DD-MM-YYYY') }}</span
          ><v-spacer></v-spacer>
          <span>
            {{ $moment(ordre.entree).format('HH:mm') }} -
            {{ $moment(ordre.sortie).format('HH:mm') }}
          </span>
        </v-card-actions>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>
<script>
export default {
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  props: {
    ordres: {
      type: Array,
      required: true,
    },
  },
}
</script>
<style></style>
