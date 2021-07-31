<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ on }">
      <v-btn color="primary" text v-on="on"> Paiement </v-btn>
    </template>
    <v-card>
      <v-card-title class="justify-center error--text subtitle-1"
        ><div>Confirmer le paiement de la facture {{ item.code }}</div>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="closeDelete">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text justify="center" align="center">
        Cette action aura pour conséquence d'entrainer la libération de la
        chambre {{ item.chambre_linked.nom }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="closeDelete">Fermer</v-btn>
        <v-btn color="success" text @click="sendPay(item.id)">Payer</v-btn>
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
