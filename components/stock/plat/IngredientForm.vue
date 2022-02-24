<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn dark color="primary" block outlined v-bind="attrs" v-on="on"
        ><v-icon dark small>mdi-plus</v-icon> ajouter</v-btn
      >
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text"
          >Ajouter ingrédient de préparation</span
        >
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-5">
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
                >
                  <template #label>
                    Ingrédient<span class="red--text"><strong> *</strong></span>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="quantite"
                  :rules="[rules.required]"
                  :suffix="suffixQuantite"
                  dense
                  type="number"
                  label="Quantité"
                >
                  <template #label>
                    Quantité<span class="red--text"><strong> *</strong></span>
                  </template>
                </v-text-field>
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
        <v-btn color="error" text @click="close"> annuler </v-btn>
        <v-btn :disabled="!activeConfirm" color="primary" text @click="addItem">
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
    ...mapGetters('produit', ['produits']),
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
    this.getPlatsProducts()
  },
  methods: {
    ...mapActions('produit', ['getPlatsProducts']),
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
  },
}
</script>

<style></style>
