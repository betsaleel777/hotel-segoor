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
      <v-card-text class="mt-5">
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
                  @change="disponibilite"
                ></v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="disponible"
                  :rules="[rules.required]"
                  :suffix="suffixQuantite"
                  dense
                  readonly
                  type="number"
                  label="Quantité réelle disponible en stock"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="virtuel"
                  :suffix="suffixQuantite"
                  dense
                  readonly
                  type="number"
                  label="Quantité virtuelle disoponible en stock"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="quantite"
                  :suffix="suffixQuantite"
                  dense
                  type="number"
                  label="Quantité"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="orange" text @click="close"> annuler </v-btn>
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
      quantite: 0,
      article: null,
      disponible: 0,
      virtuel: 0,
      rules: {
        required: (value) => !!value || 'Required.',
      },
    }
  },
  computed: {
    ...mapGetters('produit', ['produits']),
    activeConfirm() {
      return this.quantite && this.article && this.disponible >= this.quantite
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
    this.getInventory()
  },
  methods: {
    ...mapActions('produit', ['getInventory', 'modifier']),
    addItem() {
      const payload = { ...this.article }
      payload.virtuel -= Number(this.quantite)
      this.modifier(payload)
      this.article.quantite = this.quantite
      this.$emit('new-list', this.article)
      this.$refs.form.reset()
      this.dialog = false
    },
    close() {
      this.dialog = false
      this.$refs.form.reset()
    },
    disponibilite() {
      this.disponible = this.article.disponible
      this.virtuel = this.article.virtuel
    },
  },
}
</script>

<style></style>
