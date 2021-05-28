<template>
  <v-row>
    <v-col v-if="listes.length > 0" cols="12">
      <v-list-item v-for="(liste, index) in listes" :key="index" dense>
        <v-list-item-content>
          <v-list-item-title
            >{{
              liste.article.charAt(0).toUpperCase() +
              liste.article.slice(1) +
              ' '
            }}{{ 'x' + liste.quantite + ' ' + liste.mesure }}</v-list-item-title
          >
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon>
            <v-icon color="error lighten-1" @click="retirer(liste)"
              >mdi-trash-can-outline</v-icon
            >
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-col>
    <v-col cols="12">
      <demande-form @new-list="ajouterListe" />
    </v-col>
  </v-row>
</template>

<script>
import DemandeForm from './DemandeForm'
export default {
  components: {
    DemandeForm,
  },
  props: {
    articles: {
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
    if (this.articles.length > 0) {
      this.listes = this.articles
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
