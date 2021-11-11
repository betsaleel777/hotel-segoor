<template>
  <v-dialog v-model="dialog" persistent max-width="800px">
    <template #activator="{ on, attrs }">
      <v-btn
        elevation="1"
        icon
        fab
        dark
        x-small
        color="primary"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon small> mdi-pencil </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Modifier facture</span>
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
                  :attach="true"
                  append-outer-icon="mdi-plus"
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
        <v-btn color="primary" text @click="save"> Modifier </v-btn>
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
    articles: {
      type: Array,
      required: true,
    },
    tables: {
      type: Array,
      required: true,
    },
    item: {
      type: Object,
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
  mounted() {
    this.settingsEdit()
  },
  methods: {
    ...mapActions({
      modifier: 'externe/facture/modifier',
    }),
    reinitialise() {
      this.settingsEdit()
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
        this.modifier({
          ...this.facture,
          plats,
          autres,
          cocktails,
          tournees,
          id: this.item.id,
          restaurant_id: this.restaurant,
        }).then((result) => {
          this.$notifier.show({ text: result.message, variant: 'success' })
          this.reinitialise()
        })
      }
    },
    settingsEdit() {
      const { description, table_id: id, selected } = this.item
      this.facture = { description, table_id: id }
      this.articlesSelected = selected.map((select) => {
        const {
          id,
          code,
          genre,
          pivot: { prix_vente: prix, quantite },
        } = select
        return {
          id,
          code,
          genre,
          prix,
          quantite,
          montant: Number(prix) * Number(quantite),
        }
      })
    },
  },
}
</script>

<style></style>
