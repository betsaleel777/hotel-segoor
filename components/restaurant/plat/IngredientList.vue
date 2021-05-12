<template>
  <v-row>
    <v-col v-if="listes.length > 0" cols="12">
      <v-list-item v-for="(liste, index) in listes" :key="index">
        <v-list-item-avatar>
          <v-btn icon>
            <v-icon color="primary lighten-1" @click="show = true"
              >mdi-information</v-icon
            >
          </v-btn>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            >{{
              liste.ingredient.charAt(0).toUpperCase() +
              liste.ingredient.slice(1) +
              ' '
            }}{{
              '(' + liste.quantite + ' ' + liste.mesure + ')'
            }}</v-list-item-title
          >
          <v-divider></v-divider>
        </v-list-item-content>
        <v-tooltip v-model="show" top>
          <span>{{ liste.description }}</span>
        </v-tooltip>
        <v-list-item-action>
          <v-btn icon>
            <v-icon color="error lighten-1" @click="retirer(liste)"
              >mdi-trash-can-outline</v-icon
            >
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-col>
    <ingredient-form @new-list="ajouterListe" />
  </v-row>
</template>

<script>
import IngredientForm from './IngredientForm'
export default {
  components: {
    IngredientForm,
  },
  props: {
    ingredients: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
  },
  data: () => {
    return {
      show: false,
      listes: [],
    }
  },
  mounted() {
    if (this.ingredients.length > 0) {
      this.listes = this.ingredients
    }
  },
  methods: {
    ajouterListe(item) {
      const index = this.listes.findIndex((element) => element.id === item.id)
      if (index !== -1) {
        item.quantite = (
          parseFloat(this.listes[index].quantite) + parseFloat(item.quantite)
        ).toFixed(2)
        this.listes.splice(index, 1, item)
      } else {
        this.listes.push(item)
      }
      this.$emit('new-in-list', this.listes)
    },
    retirer(item) {
      const index = this.listes.findIndex((element) => element.id === item.id)
      this.listes.splice(index, 1)
      this.$emit('new-in-list', this.listes)
    },
  },
}
</script>

<style></style>
