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
        ><div>Demande du {{ item.created_at }}</div>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="close">
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
              <tr v-for="(article, index) in articles" :key="index" dense>
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
        <v-btn color="error" text @click="close">Fermer</v-btn>
        <v-btn :disabled="errorFound" color="success" text @click="accept"
          >Confirmer</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
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
  async mounted() {
    // recupérer la sortie de cette demande
    const calebasse = await this.$axios.get(
      'stock/sorties/from/' + this.item.id
    )
    this.articles = calebasse.data.sortie.produits
    this.reponses = calebasse.data.sortie.produits.map((article) => {
      return { ...article, valeur: 0, error: false }
    })
  },
  methods: {
    accept() {
      this.$axios
        .put('stock/sorties/confirm/' + this.item.id, {
          articles: this.reponses,
        })
        .then((result) => {
          location.reload()
        })
    },
    close() {
      this.dialog = false
    },
  },
}
</script>

<style></style>
