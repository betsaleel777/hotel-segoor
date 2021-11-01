<template>
  <v-dialog v-model="dialog" persistent max-width="800px">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" dark color="primary" v-on="on">
        <v-icon left>mdi-plus-thick</v-icon>
        ajouter
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Créer facture</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col>
                <v-autocomplete
                  v-model="facture.table_id"
                  :items="tables"
                  item-value="id"
                  item-text="nom"
                  dense
                  outlined
                  clearable
                  label="Table"
                  append-outer-icon="mdi-plus"
                  :attach="true"
                  @click:append-outer="dialog1 = true"
                ></v-autocomplete>
                <create-table-externe
                  v-model="dialog1"
                  :restaurant="restaurant"
                />
              </v-col>
              <amount-multiple-input
                :key="key"
                v-model="articlesSelected"
                field="article"
                :items="articles"
                :read-only-price="true"
              />
              <v-col>
                <v-textarea
                  v-model="facture.description"
                  label="Commentaire"
                  auto-grow
                  outlined
                  rows="5"
                ></v-textarea>
              </v-col>
            </v-row>
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
import AmountMultipleInput from '../AmountMultipleInput.vue'
import CreateTableExterne from '../parametre/restaurant/table/CreateTableExterne.vue'
export default {
  components: { AmountMultipleInput, CreateTableExterne },
  props: {
    restaurant: {
      type: Number,
      required: true,
    },
    tables: {
      type: Array,
      required: true,
    },
    articles: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      dialog1: false,
      key: false,
      facture: {
        description: null,
        table_id: null,
      },
      articlesSelected: [],
    }
  },
  methods: {
    ...mapActions({
      ajouter: 'externe/facture/ajouter',
    }),
    reinitialise() {
      this.facture = {
        description: null,
        table_id: null,
      }
      this.articlesSelected = []
      this.dialog = false
      this.key = !this.key
    },
    save() {
      const plats = this.articlesSelected.filter(
        (article) => article.genre === 'plats'
      )
      const autres = this.articlesSelected.filter(
        (article) => article.genre === 'autres'
      )
      const cocktails = this.articlesSelected.filter(
        (article) => article.genre === 'cocktails'
      )
      const tournees = this.articlesSelected.filter(
        (article) => article.genre === 'tournees'
      )
      if (
        autres.length === 0 &&
        cocktails.length === 0 &&
        tournees.length === 0 &&
        plats.length === 0
      ) {
        this.$notifier.show({
          text: "Aucun article n'as encore été selectioné.",
          variant: 'warning',
        })
      } else {
        this.ajouter({
          ...this.facture,
          plats,
          autres,
          cocktails,
          tournees,
          restaurant_id: this.restaurant,
        }).then((result) => {
          this.$notifier.show({ text: result.message, variant: 'success' })
          this.reinitialise()
        })
      }
    },
  },
}
</script>

<style></style>
