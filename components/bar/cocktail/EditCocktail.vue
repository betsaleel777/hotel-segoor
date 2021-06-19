<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
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
        <v-icon small>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline primary--text"
          >Modifier cocktail {{ item.code }}</span
        >
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="cocktail.nom"
                  :errors="errors.nom.exist"
                  :error-messages="errors.nom.message"
                  dense
                  outlined
                  label="Designation"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="cocktail.montant"
                  :errors="errors.montant.exist"
                  :error-messages="errors.montant.message"
                  dense
                  outlined
                  label="Montant"
                  placeholder="prix de vente du cocktail"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="cocktail.description"
                  dense
                  outlined
                  label="Commentaires"
                  required
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <h3 class="text-center">Composants du coktail</h3>
              </v-col>
            </v-row>
            <article-edit-form :item="item.id" />
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
import { mapGetters, mapActions } from 'vuex'
import ArticleEditForm from './ArticleEditForm.vue'
import {
  errorsInitialise,
  // eslint-disable-next-line no-unused-vars
  errorsWriting,
} from '~/components/helper/errorsHandle'

export default {
  components: { ArticleEditForm },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => {
    const defaultForm = Object.freeze({
      nom: null,
      montant: null,
      description: null,
    })
    return {
      dialog: false,
      cocktail: Object.assign({}, defaultForm),
      errors: {
        nom: { exist: false, message: null },
        montant: { exist: false, message: null },
      },
    }
  },
  computed: {
    ...mapGetters('cocktail', ['editListes']),
  },
  mounted() {
    this.initialisation()
  },
  methods: {
    ...mapActions('cocktail', ['addEdit']),
    initialisation() {
      const { tournees, ...cocktail } = this.item
      const tourneesInitiales = tournees.map((tournee) => {
        const { pivot, ...reste } = tournee
        return { ...reste, quantite: pivot.quantite }
      })
      this.addEdit({ id: this.item.id, content: tourneesInitiales })
      this.cocktail = Object.assign({}, cocktail)
    },
    reinitialise() {
      this.initialisation()
      errorsInitialise(this.errors)
      this.dialog = false
    },
    save() {
      this.$axios
        .put('bar/cocktails/' + this.item.id, {
          ...this.cocktail,
          ingredients: this.editListes.filter(
            (element) => element.id === this.item.id
          )[0].content,
        })
        .then((result) => {
          const { message, cocktail } = result.data
          this.$notifier.show({ text: message, variant: 'success' })
          this.reinitialise()
          this.$emit('edited-cocktail', cocktail)
        })
        .catch((err) => {
          const { data } = err.response
          if (data) {
            errorsInitialise(this.errors)
            errorsWriting(data, this.errors)
          }
        })
    },
  },
}
</script>

<style></style>
