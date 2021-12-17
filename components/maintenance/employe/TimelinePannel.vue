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
          v-if="entretiens.length === 0"
          prominent
          type="secondary"
          dark
          dense
          icon="mdi-delete-empty"
        >
          <v-row align="center">
            <v-col class="grow">
              Aucun entretien trouvé pour ce critère de recherche
            </v-col>
          </v-row>
        </v-alert>
        <v-timeline v-else dense>
          <v-timeline-item
            v-for="(entretien, index) in entretiens"
            :key="index"
          >
            <v-card class="elevation-2">
              <v-card-title class="subtitle-2 text-uppercase d-flex">
                <span>{{ $moment(entretien.entree).format('DD-MM-YYYY') }}</span
                ><v-spacer></v-spacer>
                <span>
                  {{ $moment(entretien.entree).format('HH:mm') }} -
                  {{ $moment(entretien.sortie).format('HH:mm') }}
                </span>
              </v-card-title>
              <v-card-text>{{ entretien.description }}</v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-rating
                  :value="
                    entretien.note ? parseFloat(entretien.note.valeur) : 0
                  "
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  empty-icon="$ratingFull"
                  small
                  readonly
                ></v-rating>
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
  data: () => ({ entretiens: [] }),
  created() {
    if (this.action === 'completed') {
      this.entretiens = this.items.filter((item) => item.status !== null)
    } else if (this.action === 'today') {
      this.entretiens = this.items.filter((item) =>
        this.$moment().isSame(item.entree, 'days')
      )
    } else if (this.action === 'future') {
      this.entretiens = this.items.filter((item) =>
        this.$moment().isBefore(item.entree, 'days')
      )
    } else {
      this.entretiens = this.items.filter(
        (item) =>
          this.$moment().isAfter(item.entree, 'days') && item.status === null
      )
    }
  },
}
</script>
<style lang=""></style>
