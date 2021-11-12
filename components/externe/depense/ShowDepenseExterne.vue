<template>
  <v-dialog v-model="dialogue" max-width="850px">
    <template #activator="{ on: dialog }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            elevation="1"
            icon
            fab
            dark
            x-small
            color="pink"
            v-on="{ ...tooltip, ...dialog }"
            @click="getItem"
          >
            <v-icon small> mdi-eye </v-icon>
          </v-btn>
        </template>
        <span>visualiser</span>
      </v-tooltip>
    </template>
    <v-card v-if="depense">
      <v-card-title class="justify-center primary--text headline grey lighten-2"
        ><div>
          Depense {{ depense.nom }} du
          {{ $moment(depense.created_at).format('ll') }}
        </div>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="dialogue = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text justify="center" align="center">
        <div class="text-center mt-3">
          <h3>Articles Achetés</h3>
        </div>
        <v-simple-table>
          <template #default>
            <thead>
              <tr>
                <th class="text-center">Réference</th>
                <th class="text-center">Description</th>
                <th class="text-center">Quantité</th>
                <th class="text-right">Prix de vente</th>
                <th class="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(article, index) in depense.pannier"
                :key="index"
                dense
              >
                <td class="text-center">{{ article.code }}</td>
                <td class="text-center">
                  {{ article.nom }}
                </td>
                <td class="text-center">{{ article.quantite }}</td>
                <td class="text-right">
                  {{ article.prix | formater }}
                </td>
                <td class="text-right">
                  <b>{{ article.montant | formater }}</b>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" class="text-right"><b>Total</b></td>
                <td class="text-right">
                  <b>{{ calculTotal | formater }}</b>
                </td>
              </tr>
            </tfoot>
          </template>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="dialogue = false">Fermer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    dialogue: false,
    depense: null,
  }),
  computed: {
    calculTotal() {
      let total = 0
      this.depense.pannier.forEach((article) => {
        total += Number(article.quantite) * Number(article.prix)
      })
      return total
    },
  },
  methods: {
    ...mapActions({ getDepense: 'externe/depense/getItem' }),
    getItem() {
      this.getDepense(this.id).then((depense) => {
        this.depense = depense
      })
    },
  },
}
</script>

<style></style>
