<template>
  <v-dialog v-model="dialogue" max-width="500px">
    <template #activator="{ on: dialog }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            elevation="1"
            icon
            fab
            dark
            x-small
            color="error"
            v-on="{ ...tooltip, ...dialog }"
          >
            <v-icon small> mdi-delete </v-icon>
          </v-btn>
        </template>
        <span>supprimer</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="justify-center error--text headline"
        ><div>Confirmer suppression</div>
      </v-card-title>
      <v-card-text justify="center" align="center">
        Voulez vous réelement supprimer la categorie
        <b>{{ item.nom.toUpperCase() }}</b>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="dialogue = false">Fermer</v-btn>
        <v-btn color="success" text @click="deleteItemConfirm">Confirmer</v-btn>
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
    dialogue: false,
  }),
  methods: {
    deleteItemConfirm() {
      this.$axios
        .delete('parametre/categories/articles/' + this.item.id)
        .then((result) => {
          const { message, categorie } = result.data
          this.$notifier.show({ text: message, variant: 'success' })
          this.dialogue = false
          this.$emit('deleted-categorie', categorie)
        })
    },
  },
}
</script>

<style></style>
