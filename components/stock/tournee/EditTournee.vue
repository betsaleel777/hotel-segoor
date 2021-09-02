<template>
  <v-dialog v-model="dialogue" persistent max-width="600px">
    <template #activator="{ on: dialog, attrs }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            elevation="1"
            icon
            fab
            dark
            x-small
            color="primary"
            v-bind="attrs"
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
        <span class="headline primary--text">modifier la tournée </span
        ><v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="8">
                <v-text-field
                  v-model="tournee.titre"
                  :errors="errors.titre.exist"
                  :error-messages="errors.titre.message"
                  dense
                  outlined
                  label="Titre"
                  required
                >
                  <template #label>
                    Titre <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="tournee.montant"
                  :errors="errors.montant.exist"
                  :error-messages="errors.montant.message"
                  dense
                  outlined
                  label="Le prix de la tournée"
                  type="number"
                  required
                >
                  <template #label>
                    Prix de la tournée
                    <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="tournee.nombre"
                  :errors="errors.nombre.exist"
                  :error-messages="errors.nombre.message"
                  dense
                  outlined
                  label="Nombre de ballons"
                  type="number"
                  required
                >
                  <template #label>
                    Nombre de ballons
                    <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="tournee.contenance"
                  :errors="errors.contenance.exist"
                  :error-messages="errors.contenance.message"
                  dense
                  outlined
                  label="Contenance en cl"
                  suffix="cl"
                  type="number"
                  required
                >
                  <template #label>
                    Contenance
                    <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="9">
                <v-autocomplete
                  v-model="tournee.produit"
                  :errors="errors.produit.exist"
                  :error-messages="errors.produit.message"
                  :items="produits"
                  item-value="id"
                  item-text="nom"
                  dense
                  outlined
                  label="Article"
                  required
                >
                  <template #label>
                    Article <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="3">
                <create-produit :floating="false" :categories="categories" />
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
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'
import CreateProduit from '~/components/stock/produit/CreateProduit.vue'

export default {
  components: { CreateProduit },
  props: {
    produits: {
      type: Array,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => {
    return {
      dialogue: false,
      tournee: {
        produit: null,
        montant: null,
        titre: null,
        nombre: null,
        contenance: null,
      },
      errors: {
        produit: { exist: false, message: null },
        montant: { exist: false, message: null },
        titre: { exist: false, message: null },
        nombre: { exist: false, message: null },
        contenance: { exist: false, message: null },
      },
    }
  },
  mounted() {
    this.tournee = this.item
  },
  methods: {
    ...mapActions('stock/tournee', ['modifier']),
    reinitialise() {
      this.tournee = this.item
      errorsInitialise(this.errors)
      this.dialogue = false
    },
    save() {
      this.modifier({ id: this.item.id, ...this.tournee })
        .then((result) => {
          this.$notifier.show({ text: result.message, variant: 'success' })
          this.dialogue = false
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
