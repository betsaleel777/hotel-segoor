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
        ><div>
          Demande {{ item.code }} du {{ $moment(item.created_at).format('ll') }}
        </div>
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
                <th class="text-left">Quantité</th>
                <th class="text-left">Disponible</th>
                <th class="text-left">Valeur</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(article, index) in reponses" :key="index" dense>
                <td style="width: 30%">{{ article.nom }}</td>
                <td>{{ article.quantite }}</td>
                <td>{{ article.disponible }}</td>
                <td>
                  <v-text-field
                    v-model="reponses[index].valeur"
                    dense
                    type="number"
                    :suffix="article.mesure"
                    :error="quantiteCheck(index, article.disponible)"
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
        <v-btn color="warning" text @click="reject">Rejetter</v-btn>
        <v-btn :disabled="errorFound" color="success" text @click="accept"
          >Valider</v-btn
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
    disponibles: {
      type: Array,
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
    const ids = this.item.produits.map((produit) => produit.id)
    this.articles = this.disponibles.filter((disponible) =>
      ids.find((id) => disponible.id === id)
    )
    const quantiteDisponible = (id) => {
      if (this.articles.length > 0) {
        const articleFound = this.articles.find((article) => article.id === id)
        return articleFound.disponible
      }
    }
    this.reponses = this.item.produits.map((article) => {
      return {
        id: article.id,
        nom: article.nom,
        mesure: article.mesure ?? 'btl',
        quantite: article.pivot.quantite,
        disponible: quantiteDisponible(article.id),
        valeur: 0,
        error: false,
      }
    })
  },
  methods: {
    ...mapActions({
      accepter: 'stock/demande/accept',
      rejetter: 'stock/demande/reject',
    }),
    quantiteCheck(index, dispo) {
      const check = this.reponses[index].valeur > parseInt(dispo)
      check
        ? (this.reponses[index].error = true)
        : (this.reponses[index].error = false)
      return check
    },
    accept() {
      this.accepter({ id: this.item.id, articles: this.reponses }).then(
        (result) => {
          this.$notifier.show({ text: result.message, variant: 'success' })
          this.dialog = false
        }
      )
    },
    reject() {
      this.rejetter({ id: this.item.id }).then((result) => {
        this.$notifier.show({ text: result.data.message, variant: 'success' })
        this.dialog = false
      })
    },
  },
}
</script>

<style></style>
