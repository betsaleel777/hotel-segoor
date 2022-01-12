<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" dark color="primary" v-on="on">
        <v-icon left>mdi-plus-thick</v-icon>
        AJOUTER
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Créer une demande</span>
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
                >
                  <template #label>
                    Titre<span class="red--text"><strong> *</strong></span>
                  </template>
                </v-text-field>
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
import { mapActions } from 'vuex'
import ArticleList from '~/components/restaurant/demande/ArticleList.vue'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'

export default {
  components: { ArticleList },
  props: {
    departement: {
      type: Number,
      required: true,
    },
  },
  data: () => {
    return {
      dialog: false,
      articles: [],
      titre: null,
      errors: {
        titre: { exist: false, message: null },
      },
    }
  },
  methods: {
    ...mapActions('stock/demande', ['ajouter']),
    reinitialise() {
      this.$refs.form.reset()
      this.articles.splice(0)
      this.dialog = false
      errorsInitialise(this.errors)
    },
    save() {
      const articles = this.articles
      if (articles.length > 0) {
        this.ajouter({
          articles,
          departement: this.departement,
          titre: this.titre,
        })
          .then((result) => {
            this.reinitialise()
            this.$notifier.show({
              text: result.data.message,
              variant: 'success',
            })
          })
          .catch((err) => {
            const { data } = err.response
            if (data) {
              errorsInitialise(this.errors)
              errorsWriting(data, this.errors)
            }
          })
      } else {
        const message = 'La demande doit contenir au moins un article.'
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
