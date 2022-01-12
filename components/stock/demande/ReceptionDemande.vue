<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on }">
      <v-btn
        elevation="1"
        icon
        fab
        dark
        x-small
        color="blue darken-4"
        v-on="on"
      >
        <v-icon small> mdi-cog-outline </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="justify-center primary--text headline grey lighten-2"
        ><div>Demande du {{ $moment(item.created_at).format('ll') }}</div>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-simple-table>
          <template #default>
            <thead>
              <tr>
                <th class="text-left">Description</th>
                <th class="text-left">Demandées</th>
                <th class="text-left">livrées</th>
                <th class="text-left">reçues</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(article, index) in reponses" :key="index" dense>
                <td style="width: 30%">{{ article.nom }}</td>
                <td>{{ article.pivot.demandees + article.mesure }}</td>
                <td>{{ article.pivot.quantite + article.mesure }}</td>
                <td>
                  <v-text-field
                    v-model="reponses[index].valeur"
                    dense
                    type="number"
                  >
                  </v-text-field>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="dialog = false">Fermer</v-btn>
        <v-btn :disabled="errorFound" color="success" text @click="confirmer"
          >Confirmer</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    articles: [],
    reponses: [],
  }),
  computed: {
    errorFound() {
      let found = false
      for (const reponse of this.reponses) {
        if (reponse.error === true) {
          found = true
          break
        }
      }
      return found
    },
  },
  mounted() {
    this.reponses = this.item.sortie.produits.map((article) => {
      return { ...article, valeur: 0, error: false }
    })
  },
  methods: {
    ...mapActions('stock/demande', ['confirm']),
    confirmer() {
      this.confirm({
        id: this.item.id,
        departement: this.item.departement,
        articles: this.reponses,
      }).then((result) => {
        this.$notifier.show({ text: result.message, variant: 'success' })
      })
    },
  },
}
</script>

<style></style>
