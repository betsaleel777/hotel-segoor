<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn dark color="primary" block outlined v-bind="attrs" v-on="on"
        ><v-icon dark small>mdi-plus</v-icon> ajouter</v-btn
      >
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Ajouter un article</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-autocomplete
                  v-model="article"
                  :rules="[rules.required]"
                  :items="produits"
                  item-value="id"
                  item-text="nom"
                  return-object
                  dense
                  label="Article"
                  required
                >
                  <template #label>
                    Article<span class="red--text"><strong> *</strong></span>
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
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="close">annuler</v-btn>
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
      article: null,
      rules: {
        required: (value) => !!value || 'Required.',
      },
    }
  },
  computed: {
    ...mapGetters('produit', ['produits']),
    activeConfirm() {
      return this.quantite && this.article
    },
    suffixQuantite() {
      let mesure = ''
      if (this.article) {
        mesure = this.article.mesure
      }
      return mesure
    },
  },
  mounted() {
    this.getAllProducts()
  },
  methods: {
    ...mapActions('produit', ['getAllProducts']),
    addItem() {
      let mesure = ''
      if (this.article.mesure) mesure = this.article.mesure
      const payload = {
        id: this.article.id,
        article: this.article.nom,
        quantite: this.quantite,
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
