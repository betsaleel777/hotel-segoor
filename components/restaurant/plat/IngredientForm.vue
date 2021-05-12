<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn dark color="primary" block outlined v-bind="attrs" v-on="on"
        ><v-icon dark small>mdi-plus</v-icon> ajouter</v-btn
      >
    </template>
    <v-card>
      <v-card-title>
        <span class="headline primary--text"
          >Ajouter ingrédient de préparation</span
        >
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-autocomplete
                  v-model="ingredient"
                  :rules="[rules.required]"
                  :items="produits"
                  item-value="id"
                  item-text="nom"
                  return-object
                  dense
                  label="Ingrédient"
                  required
                ></v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="quantite"
                  :rules="[rules.required]"
                  :suffix="suffixQuantite"
                  dense
                  type="number"
                  label="Quantité"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="commentaire"
                  outlined
                  label="Commentaire"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close"> annuler </v-btn>
        <v-btn
          :disabled="!activeConfirm"
          color="blue darken-1"
          text
          @click="addItem"
        >
          confirmer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data: () => {
    return {
      dialog: false,
      quantite: null,
      ingredient: null,
      type: false,
      commentaire: '',
      rules: {
        required: (value) => !!value || 'Required.',
      },
    }
  },
  computed: {
    ...mapGetters('plat', ['produits']),
    activeConfirm() {
      return this.quantite && this.ingredient
    },
    suffixQuantite() {
      let mesure = ''
      if (this.ingredient) {
        mesure = this.ingredient.mesure
      }
      return mesure
    },
  },
  mounted() {
    this.getProducts()
  },
  methods: {
    ...mapActions('plat', ['getProducts']),
    addItem() {
      let mesure = ''
      if (this.ingredient.mesure) mesure = this.ingredient.mesure
      if (this.ingredient.type !== 'standard') this.quantite = 0

      const payload = {
        id: this.ingredient.id,
        ingredient: this.ingredient.nom,
        type: this.ingredient.type,
        quantite: this.quantite ? this.quantite : 0,
        commentaire: this.commentaire,
        mesure,
      }
      this.$emit('new-list', payload)
      this.$refs.form.reset()
      this.dialog = false
    },
    close() {
      this.dialog = false
      this.$refs.form.reset()
    },
    // getQuantiteStock() {
    //   if (this.quantiteStock === 0) {
    //     if (!isNaN(this.quantite) && this.ingredient) {
    //       this.$axios
    //         .get('restaurant/achats/en-stock/' + this.ingredient.id)
    //         .then((result) => {
    //           this.quantiteStock = result.data.quantite
    //         })
    //     }
    //   }
    // },
    // checkStock() {
    //   const ingredients = this.listes()
    //   let quantiteDemandee = 0
    //   const index = ingredients.findIndex(
    //     (element) => element.id === this.ingredient.id
    //   )
    //   if (index !== -1) {
    //     quantiteDemandee =
    //       parseFloat(ingredients[index].quantite) + parseFloat(this.quantite)
    //   } else {
    //     quantiteDemandee = parseFloat(this.quantite)
    //   }
    //   if (quantiteDemandee < parseFloat(this.quantiteStock)) {
    //     this.error = false
    //     this.success = true
    //     this.message.error = ''
    //     this.message.success = 'Stock suffisant pour cette quantité demandée.'
    //   } else {
    //     this.success = false
    //     this.error = true
    //     this.message.success = ''
    //     this.message.error =
    //       'Le stock est insuffisant pour cette quantité demandée'
    //   }
    // },
  },
}
</script>

<style></style>
