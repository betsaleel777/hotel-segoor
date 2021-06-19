<template>
  <v-row>
    <v-col v-if="liste.length > 0" cols="12">
      <v-list-item v-for="(ligne, index) in liste" :key="index" dense>
        <!-- <v-list-item-avatar>
          <v-btn icon>
            <v-icon color="primary lighten-1" @click="show = true"
              >mdi-information</v-icon
            >
          </v-btn>
        </v-list-item-avatar> -->
        <v-list-item-content>
          <v-list-item-title
            >{{ ligne.titre + ' '
            }}{{
              '(' + Number(ligne.quantite) + ' tournée)'
            }}</v-list-item-title
          >
          <v-divider></v-divider>
        </v-list-item-content>
        <!-- <v-tooltip v-model="show" top>
          <span>{{ liste.description }}</span>
        </v-tooltip> -->
        <v-list-item-action>
          <v-btn icon>
            <v-icon color="error lighten-1" @click="retirer(ligne)"
              >mdi-trash-can-outline</v-icon
            >
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data: () => {
    return {
      show: false,
      listes: [],
    }
  },
  computed: {
    ...mapGetters('cocktail', ['liste']),
  },
  methods: {
    ...mapActions('cocktail', ['listeRemove']),
    retirer(item) {
      this.listeRemove(item.id)
    },
  },
}
</script>

<style></style>
