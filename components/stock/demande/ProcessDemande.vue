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
        ><div>Demande {{ item.code }} du {{ item.created_at }}</div>
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
                <th class="text-left">Réference</th>
                <th class="text-left">Description</th>
                <th class="text-left">Quantité</th>
                <th class="text-left">Disponible</th>
                <th class="text-left">Valeur</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(article, index) in articles" :key="index" dense>
                <td>{{ article.code }}</td>
                <td style="width: 30%">{{ article.nom }}</td>
                <td>{{ article.quantite + article.mesure }}</td>
                <td>{{ article.disponible + article.mesure }}</td>
                <td>
                  <v-text-field
                    v-model="reponses[index].valeur"
                    dense
                    type="number"
                    :error="quantiteCheck(index, article.disponible)"
                    :suffix="article.mesure"
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
        <v-btn color="warning" text @click="reject">Rejetter</v-btn>
        <v-btn
          :disabled="errorFound"
          color="success"
          text
          @click="accept(item.id)"
          >Valider</v-btn
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
    const calebasse = await this.$axios.get(
      'stock/demandes/traitement/' + this.item.id
    )
    this.articles = calebasse.data.articles
    this.reponses = calebasse.data.articles.map((article) => {
      return { ...article, valeur: article.quantite, error: false }
    })
  },
  methods: {
    quantiteCheck(index, dispo) {
      const check = this.reponses[index].valeur > parseInt(dispo)
      check
        ? (this.reponses[index].error = true)
        : (this.reponses[index].error = false)
      return check
    },
    accept(id) {
      this.$axios
        .put('stock/demandes/accept/' + id, { articles: this.reponses })
        .then((result) => {
          const { message, demande } = result.data
          this.$notifier.show({ text: message, variant: 'success' })
          this.close()
          this.$emit('accepted-demande', demande)
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message)
        })
    },
    reject() {
      this.$axios
        .get('stock/demandes/reject/' + this.item.id)
        .then((result) => {
          const { message, demande } = result.data
          this.$notifier.show({ text: message, variant: 'success' })
          this.close()
          this.$emit('rejected-demande', demande)
        })
    },
    close() {
      // this.articles = Object.freeze(this.item.produits)
      this.dialog = false
    },
  },
}
</script>

<style></style>
