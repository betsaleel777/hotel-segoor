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
        Voulez vous supprimer la réservation de la chambre
        <b>{{ item.chambre_linked.nom.toUpperCase() }}</b
        ><br />
        pour le client: <b>{{ item.client_linked.nom }}</b> ?
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
  },
  data: () => {
    return {
      dialogue: false,
    }
  },
  methods: {
    ...mapActions('reception/reservation', ['supprimer']),
    deleteItemConfirm() {
      this.supprimer(this.item.id).then((result) => {
        this.$notifier.show({ text: result.message, variant: 'success' })
        this.dialogue = false
      })
    },
  },
}
</script>

<style></style>
