<template lang="html">
  <v-expansion-panel active-class="grey lighten-3">
    <v-expansion-panel-header color="primary darken-4">
      <span class="white--text">{{ titre }}</span>
      <template #actions>
        <v-icon color="white"> $expand </v-icon>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-container>
        <v-alert
          v-if="ordres.length === 0"
          prominent
          color="secondary"
          dark
          dense
          icon="mdi-delete-empty"
        >
          <v-row align="center">
            <v-col class="grow">
              Aucune réparation trouvé pour ce critère de recherche
            </v-col>
          </v-row>
        </v-alert>
        <v-timeline v-else dense>
          <v-timeline-item v-for="(ordre, index) in ordres" :key="index">
            <v-card class="elevation-2">
              <v-card-title class="subtitle-2 text-uppercase d-flex">
                <span>{{ $moment(ordre.entree).format('DD-MM-YYYY') }}</span
                ><v-spacer></v-spacer>
                <span>
                  {{ $moment(ordre.entree).format('HH:mm') }} -
                  {{ $moment(ordre.sortie).format('HH:mm') }}
                </span>
              </v-card-title>
              <v-card-text v-html="ordre.description"></v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                {{ ordre.montant | formater }}
              </v-card-actions>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-container>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script>
export default {
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  inject: ['id'],
  props: {
    titre: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
  },
  data: () => ({ ordres: [] }),
  created() {
    if (this.action === 'completed') {
      this.ordres = this.items.filter((item) => item.status !== 'complete')
    } else if (this.action === 'today') {
      this.ordres = this.items.filter((item) =>
        this.$moment().isSame(item.entree, 'days')
      )
    } else if (this.action === 'future') {
      this.ordres = this.items.filter((item) =>
        this.$moment().isBefore(item.entree, 'days')
      )
    } else if (this.action === 'incompleted') {
      this.ordres = this.items.filter((item) => item.status === 'incomplete')
    } else {
      this.ordres = this.items.filter(
        (item) =>
          this.$moment().isAfter(item.entree, 'days') && item.status === null
      )
    }
  },
}
</script>
<style lang=""></style>
