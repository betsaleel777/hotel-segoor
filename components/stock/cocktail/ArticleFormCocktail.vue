<template>
  <v-row>
    <v-col cols="7">
      <v-autocomplete
        v-model="tournee"
        :items="tournees"
        item-value="id"
        item-text="titre"
        return-object
        dense
        outlined
        label="Articles"
        required
      >
        <template #label>
          Articles<span class="red--text"><strong> *</strong></span>
        </template>
      </v-autocomplete>
    </v-col>
    <v-col cols="4">
      <v-text-field
        v-model="quantite"
        dense
        outlined
        label="Nombre de tournée"
        type="number"
        min="0"
        required
      >
        <template #label>
          Nombre de tournée<span class="red--text"><strong> *</strong></span>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="1">
      <v-btn dark color="primary" elevation="4" fab small @click="addTournee"
        ><v-icon dark>mdi-plus</v-icon></v-btn
      >
    </v-col>
    <article-list-cocktail />
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
import ArticleListCocktail from './ArticleListCocktail.vue'
export default {
  components: { ArticleListCocktail },
  data: () => ({
    tournee: {},
    quantite: 0,
    tournees: [],
  }),
  mounted() {
    this.$axios.get('bar/tournees').then((result) => {
      this.tournees = result.data.tournees
    })
  },
  methods: {
    ...mapActions('cocktail', ['listeAdd']),
    addTournee() {
      if (this.tournee && this.quantite !== 0) {
        this.listeAdd({ ...this.tournee, quantite: this.quantite })
        this.tournee = {}
        this.quantite = 0
      } else {
        const message = 'veuillez remplir correctement les champs'
        this.$notifier.show({ text: message, variant: 'error' })
      }
    },
  },
}
</script>

<style></style>
