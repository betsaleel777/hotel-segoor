<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ on }">
      <v-btn color="warning" text v-on="on">Annuler </v-btn>
    </template>
    <v-card>
      <v-card-title class="justify-center error--text headline"
        ><div>Confirmer annulation</div>
      </v-card-title>
      <v-card-text justify="center" align="center">
        Voulez vous annuler la reservation pour la chambre
        <b>{{ item.chambre_linked.nom | upper }}</b
        >, concernant le client: <b>{{ item.client_linked.nom | upper }}</b> ?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="dialog = false">Fermer</v-btn>
        <v-btn color="primary" text @click="freeItemConfirm">OK</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  filters: {
    upper(value) {
      if (!value) return ''
      return value.toUpperCase()
    },
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => {
    return {
      dialog: false,
    }
  },
  methods: {
    ...mapActions('reception/reservation', ['annuler']),
    freeItemConfirm() {
      this.annuler(this.item.id).then((result) => {
        this.$notifier.show({ text: result.message, variant: 'success' })
        this.dialog = false
        this.$emit('aborted')
      })
    },
  },
}
</script>

<style></style>
