<template>
  <v-dialog v-model="dialog" persistent max-width="650px">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" dark color="primary" v-on="on">
        <v-icon left>mdi-cogs</v-icon>
        Parametre du point
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="justify-center primary--text headline"
        ><div>Réglages du point financier</div>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="8">
              <v-radio-group v-model="mode" row>
                <v-radio label="journalier" :value="0"></v-radio>
                <v-spacer></v-spacer>
                <v-radio label="intervalle de date" :value="1"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="2"></v-col>
            <v-col cols="12">
              <div v-show="mode === 0">
                <v-subheader class="primary--text darken-3"
                  >Choisir une seule date</v-subheader
                >
                <v-date-picker
                  v-model="laDate"
                  locale="fr"
                  full-width
                ></v-date-picker>
              </div>
              <div v-show="mode === 1">
                <v-subheader dark class="primary--text darken-3"
                  >Choix multiple de date</v-subheader
                >
                <v-date-picker
                  v-model="lesDates"
                  locale="fr"
                  full-width
                  range
                ></v-date-picker>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-4" text @click="close">Fermer</v-btn>
        <v-btn color="blue darken-4" text @click="finish">OK</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => {
    return {
      dialog: false,
      mode: null,
      laDate: '',
      lesDates: [],
    }
  },
  mounted() {},
  methods: {
    run() {
      this.$axios.delete().then((result) => {})
    },
    close() {
      this.dialog = false
      this.lesDates = []
      this.laDate = ''
      this.mode = null
    },
    finish() {
      this.$emit('reglage-finished', this.laDate, this.lesDates)
      this.close()
    },
  },
}
</script>

<style></style>
