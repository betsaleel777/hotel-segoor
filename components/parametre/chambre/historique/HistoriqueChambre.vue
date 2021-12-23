<template>
  <v-container fluid>
    <v-card color="grey" flat>
      <v-toolbar dense class="elevation-0">
        <v-toolbar-title
          ><v-icon color="primary darken-2" left>mdi-history</v-icon
          >{{ selected.text }}</v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-menu bottom left transition="scale-transition">
          <template #activator="{ on, attrs }">
            <v-btn color="indigo" icon v-bind="attrs" v-on="on">
              <v-icon color="primary darken-2">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item-group color="indigo">
              <v-list-item v-for="(mode, i) in modes" :key="i">
                <v-list-item-content>
                  <v-list-item-title>
                    <v-btn small text color="indigo" @click="clique(mode)">{{
                      mode.text
                    }}</v-btn>
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-icon color="primary darken-2" v-text="mode.icon"></v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-card-text>
        <HistoriqueChambreTimeline :key="key" :mode="selected.id" />
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import HistoriqueChambreTimeline from './HistoriqueChambreTimeline.vue'
export default {
  components: { HistoriqueChambreTimeline },
  props: {
    nom: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selected: { id: 0, text: `Historique de la chambre ${this.nom}` },
      modes: [
        { id: 1, text: 'Historique des Hébergements', icon: 'mdi-bed' },
        {
          id: 2,
          text: 'Historique des Entretiens',
          icon: 'mdi-progress-wrench',
        },
        {
          id: 3,
          text: 'Historique des Réparations',
          icon: 'mdi-hammer-wrench',
        },
      ],
      key: false,
    }
  },
  methods: {
    clique(mode) {
      this.key = !this.key
      this.selected = mode
    },
  },
}
</script>
<style lang=""></style>
