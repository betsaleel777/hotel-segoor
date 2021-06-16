<template>
  <v-dialog v-model="dialog" persistent max-width="900px">
    <template #activator="{ on, attrs }">
      <v-btn
        v-if="floating"
        v-bind="attrs"
        color="primary"
        dark
        absolute
        bottom
        right
        fab
        v-on="on"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn v-else v-bind="attrs" dark color="primary" v-on="on">
        <v-icon left>mdi-plus-thick</v-icon>
        ENCAISSER
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline primary--text">Encaissement</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="encaissement.attribution"
                  :items="attributions"
                  item-value="id"
                  item-text="nom"
                  dense
                  outlined
                  label="Clients en chambre"
                  required
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
          <v-container>
            <article-form :produits="produits" @liste-update="listeUpdate" />
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="reinitialise"> Fermer </v-btn>
        <v-btn color="blue darken-1" text @click="save"> Créer </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ArticleForm from './ArticleForm.vue'

export default {
  components: { ArticleForm },
  props: {
    attributions: {
      type: Array,
      required: true,
    },
    produits: {
      type: Array,
      required: true,
    },
    floating: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    const defaultForm = Object.freeze({
      attribution: null,
      departement: null,
    })
    return {
      dialog: false,
      encaissement: Object.assign({}, defaultForm),
      articles: [],
      plats: [],
      boissons: [],
    }
  },
  mounted() {
    // doit recuperer le departement de l'utilisateur
    this.$axios.get('parametre/departements/' + 'restaurant').then((result) => {
      this.encaissement.departement = result.data.departement.id
    })
  },
  methods: {
    reinitialise() {
      this.articles = []
      this.encaissement.attribution = null
      this.$root.$emit('vider_caisse')
      this.dialog = false
    },
    save() {
      this.plats = this.articles.filter((article) => article.genre === 'plats')
      this.boissons = this.articles.filter(
        (article) => article.genre === 'boissons'
      )
      this.$axios
        .post('caisses/encaissements/new', {
          ...this.encaissement,
          plats: this.plats,
          boissons: this.boissons,
        })
        .then((result) => {
          const { message, encaissement } = result.data
          this.$notifier.show({ text: message, variant: 'success' })
          this.reinitialise()
          this.$emit('new-encaissement', encaissement)
        })
        .catch()
    },
    listeUpdate(reponses) {
      this.articles = reponses
    },
  },
}
</script>

<style></style>
