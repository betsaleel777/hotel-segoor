<template>
  <v-dialog v-model="dialog" persistent max-width="900px">
    <template #activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        color="primary"
        elevation="1"
        icon
        fab
        dark
        x-small
        v-on="on"
      >
        <v-icon small>mdi-cart-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline primary--text"
          >Completer Encaissement {{ item.code }}</span
        >
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="4">
                <div class="text-left">
                  <div>
                    <h2 :class="getColor">{{ item.status }}</h2>
                    <span v-if="item.attribution">
                      <h4>
                        {{
                          item.attribution.client_linked.nom +
                          ' ' +
                          item.attribution.client_linked.prenom
                        }}
                      </h4>
                      <h4>{{ item.attribution.client_linked.contact }}</h4>
                      <h4>Chambre {{ item.attribution.chambre_linked.nom }}</h4>
                    </span>
                  </div>
                </div>
              </v-col>
              <v-col cols="4">
                <div class="text-center"></div>
              </v-col>
              <v-col cols="4">
                <div class="text-right">
                  <h3>{{ item.created_at }}</h3>
                </div>
              </v-col>
            </v-row>
          </v-container>
          <v-container>
            <article-form-edit-bar
              :produits-selected="produitsSelected"
              :produits="produits"
              @liste-update="listeUpdate"
            />
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="reinitialise"> Fermer </v-btn>
        <v-btn color="blue darken-1" text @click="save"> Completer </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ArticleFormEditBar from './ArticleFormEditBar.vue'

export default {
  components: { ArticleFormEditBar },
  props: {
    item: {
      type: Object,
      required: true,
    },
    produits: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      articles: [],
      produitsSelected: [],
    }
  },
  computed: {
    getColor() {
      if (this.item.status === 'soldée') {
        return 'green--text'
      } else {
        return 'red--text'
      }
    },
  },
  mounted() {
    const tournees = this.item.tournees.map((tournee) => {
      return { ...tournee, nom: tournee.titre }
    })
    this.produitsSelected = [
      ...this.item.produits,
      ...this.item.plats,
      ...this.item.cocktails,
      ...tournees,
    ]
  },
  methods: {
    reinitialise() {
      this.dialog = false
    },
    save() {
      const plats = this.articles.filter((article) => article.genre === 'plats')
      const boissons = this.articles.filter(
        (article) => article.genre === 'boissons'
      )
      const tournees = this.articles.filter(
        (article) => article.genre === 'tournees'
      )
      const cocktails = this.articles.filter(
        (article) => article.genre === 'cocktails'
      )
      this.$axios
        .put('caisses/encaissements/' + this.item.id, {
          plats,
          boissons,
          tournees,
          cocktails,
        })
        .then((result) => {
          const { message, encaissement } = result.data
          this.$notifier.show({ text: message, variant: 'success' })
          this.reinitialise()
          this.$emit('completed-encaissement', encaissement)
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
