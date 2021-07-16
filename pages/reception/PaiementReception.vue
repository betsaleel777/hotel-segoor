<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ on }">
      <v-btn color="green darken-1" text v-on="on">
        Paiement et libération
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="justify-center error--text headline"
        ><div>Confirmer le paiement de la facture {{ item.code }}</div>
      </v-card-title>
      <v-card-text justify="center" align="center">
        Cette action aura pour conséquence d'entrainer la libération de la
        chambre {{ item.chambre_linked.nom }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-4" text @click="closeDelete">Fermer</v-btn>
        <v-btn color="blue darken-4" text @click="sendPay(item.id)">OK</v-btn>
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
  data: () => {
    return {
      dialog: true,
    }
  },
  methods: {
    sendPay(id) {
      this.$axios.post('caisse/encaissements/' + id).then((result) => {
        const { message, encaissement } = result.data
        this.$notifier.show({ text: message, variant: 'success' })
        this.closeDelete()
        this.$emit('paid', encaissement)
      })
    },
    closeDelete() {
      this.dialog = false
    },
  },
}
</script>

<style></style>
