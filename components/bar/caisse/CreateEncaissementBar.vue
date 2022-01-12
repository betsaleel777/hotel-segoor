<template>
  <v-dialog v-model="dialog" persistent max-width="900px">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" dark color="primary" v-on="on">
        <v-icon left>mdi-plus-thick</v-icon>
        CREER LA FACTURE
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text"
          >Enregistrer la consommation du client</span
        >
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="8">
                <v-autocomplete
                  v-model="encaissement.attribution"
                  :items="attributions"
                  item-value="id"
                  item-text="nom"
                  dense
                  outlined
                  clearable
                  label="Clients en chambre"
                  required
                ></v-autocomplete>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="encaissement.zone"
                  dense
                  outlined
                  label="Numero de table"
                  required
                ></v-text-field>
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
        <v-btn color="error" text @click="reinitialise"> Fermer </v-btn>
        <v-btn color="primary" text @click="save"> Créer </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import ArticleForm from './ArticleFormBar.vue'
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
  },
  data() {
    const defaultForm = Object.freeze({
      attribution: null,
      departement: 2,
      zone: null,
    })
    return {
      dialog: false,
      encaissement: Object.assign({}, defaultForm),
      articles: [],
    }
  },
  methods: {
    ...mapActions('caisse/encaissement', ['ajouter']),
    reinitialise() {
      this.articles = []
      this.encaissement.attribution = null
      this.$root.$emit('vider_caisse')
      this.dialog = false
    },
    save() {
      const boissons = this.articles.filter(
        (article) => article.genre === 'boissons'
      )
      const cocktails = this.articles.filter(
        (article) => article.genre === 'cocktails'
      )
      const tournees = this.articles.filter(
        (article) => article.genre === 'tournees'
      )
      if (
        boissons.length === 0 &&
        cocktails.length === 0 &&
        tournees.length === 0
      ) {
        this.$notifier.show({
          text: "Aucun article n'as encore été selectioné.",
          variant: 'warning',
        })
      } else {
        this.ajouter({
          ...this.encaissement,
          boissons,
          cocktails,
          tournees,
          departement: 2,
        }).then((result) => {
          this.$notifier.show({ text: result.message, variant: 'success' })
          this.reinitialise()
        })
      }
    },
    listeUpdate(reponses) {
      this.articles = reponses
    },
  },
}
</script>

<style></style>
