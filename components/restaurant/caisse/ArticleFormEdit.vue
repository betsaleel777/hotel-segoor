<template>
  <v-row>
    <v-col cols="5">
      <v-autocomplete
        v-model="article"
        :items="produits"
        item-value="id"
        item-text="nom"
        return-object
        dense
        outlined
        label="Articles"
        required
        @change="articleSelected"
      ></v-autocomplete>
    </v-col>
    <v-col cols="3">
      <v-text-field
        v-model="vente"
        dense
        outlined
        :suffix="suffixQuantite"
        label="Prix de vente"
        readonly
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        v-model="valeur"
        dense
        outlined
        type="number"
        min="0"
        :suffix="suffixQuantite"
        label="Quantité"
      ></v-text-field>
    </v-col>
    <v-col cols="1">
      <v-btn dark color="primary" elevation="4" fab small @click="addArticle"
        ><v-icon dark>mdi-plus</v-icon></v-btn
      >
    </v-col>
    <article-list
      :key="cle"
      :reponses="reponses"
      @reponse-update="removeArticle"
    />
  </v-row>
</template>

<script>
import ArticleList from './ArticleList'
export default {
  components: { ArticleList },
  props: {
    produits: {
      type: Array,
      required: true,
    },
    produitsSelected: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    article: {},
    valeur: 0,
    vente: 0,
    cle: false,
    reponses: [],
  }),
  computed: {
    suffixQuantite() {
      return this.article ? this.article.mesure : ''
    },
  },
  mounted() {
    // this.$root.$on('vider_caisse', () => {
    //   this.reponses = []
    //   this.cle = !this.cle
    // })
    const reponses = this.produitsSelected.map((produit) => {
      return {
        id: produit.id,
        code: produit.code,
        nom: produit.nom,
        genre: produit.genre,
        valeur: produit.pivot.quantite,
        prix_vente: produit.pivot.prix_vente,
        nouveau: false,
      }
    })
    this.reponses = reponses
  },
  methods: {
    reinitialise() {
      this.article = {}
      this.valeur = 0
      this.vente = 0
    },
    articleSelected() {
      this.vente = this.article.prix_vente
    },
    addArticle() {
      if (this.valeur === 0 || Object.keys(this.article).length === 0) {
        const message = 'Veuillez remplir correctement les champs'
        this.$notifier.show({ text: message, variant: 'error' })
      } else {
        const article = Object.assign({}, this.article)
        article.valeur = this.valeur
        article.nouveau = true
        const index = this.reponses.findIndex(
          (element) => element.id === article.id
        )
        index === -1
          ? this.reponses.push(article)
          : this.reponses.splice(index, 1, article)
        this.cle = !this.cle
        this.reinitialise()
        this.$emit('liste-update', this.reponses)
      }
    },
    removeArticle(reponse) {
      const index = this.reponses.findIndex(
        (element) => element.id === reponse.id
      )
      this.reponses.splice(index, 1)
      this.cle = !this.cle
      this.$emit('liste-update', this.reponses)
    },
  },
}
</script>

<style></style>
