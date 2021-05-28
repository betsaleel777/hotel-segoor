<template>
  <v-dialog v-model="dialog" max-width="700px">
    <template #activator="{ on }">
      <v-btn
        elevation="1"
        icon
        fab
        dark
        x-small
        color="yellow darken-4"
        v-on="on"
      >
        <v-icon small> mdi-truck-delivery </v-icon>
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
              disabled
              :suffix="article.mesure"
              dense
              prepend-icon="mdi-pencil"
            ></v-text-field>
          </v-list-item-content>
          <v-list-item-action> </v-list-item-action>
        </v-list-item>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-4" text @click="deliver(item.id)"
          >Livrer La Demande</v-btn
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
  }),
  mounted() {
    this.articles = Object.assign([], this.item.produits)
  },
  methods: {
    deliver(id) {
      this.$axios
        .get('stock/demandes/deliver/' + id)
        .then((result) => {
          const { message, demande } = result.data
          this.$notifier.show({ text: message, variant: 'success' })
          this.close()
          this.$emit('delivered-demande', demande)
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message)
        })
    },
    close() {
      this.dialog = false
    },
  },
}
</script>

<style></style>
