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
      ></v-autocomplete>
    </v-col>
    <v-col cols="4">
      <v-text-field
        v-model="quantite"
        dense
        outlined
        label="Nombre de tournée"
        type="number"
        suffix="tournée(s)"
        min="0"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="1">
      <v-btn dark color="primary" elevation="4" fab small @click="addTournee"
        ><v-icon dark>mdi-plus</v-icon></v-btn
      >
    </v-col>
    <article-edit-list :item="item" />
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
import ArticleEditList from './ArticleEditList.vue'
export default {
  components: { ArticleEditList },
  props: {
    item: {
      type: Number,
      required: true,
    },
  },
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
    ...mapActions('cocktail', ['addEditContent']),
    addTournee() {
      if (this.tournee && this.quantite !== 0) {
        this.addEditContent({
          id: this.item,
          content: { ...this.tournee, quantite: this.quantite },
        })
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
