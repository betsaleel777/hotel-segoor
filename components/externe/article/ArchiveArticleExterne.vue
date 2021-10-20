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
            <v-icon small> mdi-archive-plus </v-icon>
          </v-btn>
        </template>
        <span>archiver</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="justify-center error--text headline"
        ><div>Confirmer archivage</div>
      </v-card-title>
      <v-card-text justify="center" align="center">
        Voulez vous archiver l'article
        <b>{{ item.nom.toUpperCase() }}</b>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="dialogue = false">Fermer</v-btn>
        <v-btn color="primary" text @click="deleteItemConfirm">OK</v-btn>
        <v-spacer></v-spacer>
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
    restaurant: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    dialogue: false,
  }),
  methods: {
    ...mapActions('externe/article', ['archiver']),
    deleteItemConfirm() {
      this.archiver({ id: this.item.id, restaurant_id: this.restaurant }).then(
        (result) => {
          this.$notifier.show({ text: result.message, variant: 'success' })
          this.dialogue = false
        }
      )
    },
  },
}
</script>

<style></style>
