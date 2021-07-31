<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
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
        AJOUTER
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Créer une sortie de stock</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <div class="text-center"><h4>Liste des Articles</h4></div>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="titre"
                  :error="errors.titre.exist"
                  :error-messages="errors.titre.message"
                  dense
                  label="Titre"
                ></v-text-field>
                <v-select
                  v-model="departement"
                  :error="errors.departement.exist"
                  :error-messages="errors.departement.message"
                  :items="departements"
                  item-value="id"
                  item-text="nom"
                  label="Département"
                ></v-select>
              </v-col>
            </v-row>
            <!-- liste des article demandés -->
            <article-list :articles="[]" @new-in-list="listeUpdate" />
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
import {
  errorsInitialise,
  // eslint-disable-next-line no-unused-vars
  errorsWriting,
} from '~/components/helper/errorsHandle'
import ArticleList from '~/components/stock/sortie/ArticleList.vue'

export default {
  components: { ArticleList },
  props: {
    floating: {
      type: Boolean,
      default: true,
    },
  },
  data: () => {
    return {
      dialog: false,
      articles: [],
      departement: null,
      departements: [],
      titre: null,
      errors: {
        titre: { exist: false, message: null },
        departement: { exist: false, message: null },
      },
    }
  },
  async mounted() {
    // doit recuperer le departement de l'utilisateur
    const calebasse = await this.$axios.get('parametre/departements')
    this.departements = calebasse.data.departements
  },
  methods: {
    reinitialise() {
      this.$refs.form.reset()
      this.articles.splice(0)
      errorsInitialise(this.errors)
      this.dialog = false
    },
    save() {
      const articles = this.articles
      if (articles.length > 0) {
        this.$axios
          .post('stock/sorties/new', {
            articles,
            departement: this.departement,
            titre: this.titre,
          })
          .then((result) => {
            const { message, sortie } = result.data
            this.$notifier.show({ text: message, variant: 'success' })
            this.$emit('new-sortie', sortie)
            this.reinitialise()
          })
          .catch((err) => {
            const { data } = err.response
            if (Object.keys(data).length !== 1) {
              errorsInitialise(this.errors)
              errorsWriting(data, this.errors)
            } else {
              this.$notifier.show({
                text: err.data.message,
                variant: 'error',
              })
            }
          })
      } else {
        const message =
          'Cette sortie de stock, doit contenir au moins un article'
        this.$notifier.show({ text: message, variant: 'warning' })
      }
    },
    listeUpdate(articles) {
      this.articles = articles
    },
  },
}
</script>

<style></style>
