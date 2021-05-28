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
      <v-card-title class="justify-center primary--text headline"
        ><div>Demande {{ item.code }} du {{ item.created_at }}</div>
      </v-card-title>
      <v-card-text>
        <v-list-item v-for="(article, index) in articles" :key="index" dense>
          <v-list-item-content>
            <v-list-item-title
              >{{
                article.nom.charAt(0).toUpperCase() +
                article.nom.slice(1) +
                ' '
              }}{{
                'x' + article.pivot.quantite + ' ' + article.mesure
              }}</v-list-item-title
            >
            <v-text-field
              v-model="article.pivot.quantite"
              :suffix="article.mesure"
              :rules="[rules.required]"
              dense
              prepend-icon="mdi-pencil"
            ></v-text-field>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon>
              <v-icon color="error lighten-1" @click="retirer(article)"
                >mdi-trash-can-outline</v-icon
              >
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-4" text @click="close">Fermer</v-btn>
        <v-btn color="green darken-4" text @click="accept(item.id)"
          >Accepter</v-btn
        >
        <v-btn color="error darken-4" text @click="reject(item.id)"
          >Rejetter</v-btn
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
    rules: {
      required: (value) => !!value || 'Required.',
    },
  }),
  mounted() {
    this.articles = Object.freeze(this.item.produits)
  },
  methods: {
    accept(id) {
      this.$axios
        .put('stock/demandes/accept/' + id, { articles: this.articles })
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
    reject(id) {
      this.$axios.get('stock/demandes/reject/' + id).then((result) => {
        const { message, demande } = result.data
        this.$notifier.show({ text: message, variant: 'success' })
        this.close()
        this.$emit('rejected-demande', demande)
      })
    },
    retirer(item) {
      const index = this.articles.findIndex((element) => element.id === item.id)
      this.articles.splice(index, 1)
    },
    close() {
      this.articles = Object.freeze(this.item.produits)
      this.dialog = false
    },
  },
}
</script>

<style></style>
