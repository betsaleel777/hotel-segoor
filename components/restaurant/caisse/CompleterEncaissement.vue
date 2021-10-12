<template>
  <v-dialog v-model="dialogue" persistent max-width="900px">
    <template #activator="{ on: dialog, attrs }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            v-bind="attrs"
            color="primary"
            elevation="1"
            icon
            fab
            dark
            x-small
            v-on="{ ...tooltip, ...dialog }"
          >
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <span>modifier</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text"
          >Modifier Encaissement {{ item.code }}</span
        >
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="dialogue = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
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
            <article-form-edit
              :produits-selected="produitsSelected"
              :produits="produits"
              @liste-update="listeUpdate"
            />
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="dialogue = false"> Fermer </v-btn>
        <v-btn color="primary" text @click="save"> Modifier </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import ArticleFormEdit from './ArticleFormEdit.vue'
export default {
  components: { ArticleFormEdit },
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
      dialogue: false,
      articles: [],
      plats: [],
      produitsSelected: [],
      boissons: [],
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
    this.produitsSelected = [
      ...this.item.produits,
      ...this.item.plats,
      ...this.item.cocktails,
      ...this.item.tournees,
    ]
  },
  methods: {
    ...mapActions('caisse/encaissement', ['modifierRestau']),
    save() {
      this.plats = this.articles.filter((article) => article.genre === 'plats')
      this.boissons = this.articles.filter(
        (article) => article.genre === 'boissons'
      )
      this.cocktails = this.articles.filter(
        (article) => article.genre === 'cocktails'
      )
      this.tournees = this.articles.filter(
        (article) => article.genre === 'tournees'
      )
      if (Object.keys(this.articles).length > 0) {
        this.modifierRestau({
          plats: this.plats,
          boissons: this.boissons,
          cocktails: this.cocktails,
          tournees: this.tournees,
          id: this.item.id,
        }).then((result) => {
          this.$notifier.show({ text: result.message, variant: 'success' })
          this.dialogue = false
        })
      } else {
        this.$notifier.show({
          text: 'Aucune modification détectée',
          variant: 'info',
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
