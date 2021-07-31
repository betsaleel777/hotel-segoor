<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ on }">
      <v-btn color="green darken-1" text v-on="on"> attribuer </v-btn>
    </template>
    <v-card>
      <v-card-title class="justify-center primary--text headline"
        ><div>Confirmation d'attribution de chambre</div>
      </v-card-title>
      <v-card-text justify="center" align="center">
        Veuillez confirmer l'entrée du client
        <b>{{ item.client_linked.nom.toUpperCase() }}</b> en chambre
        <b>{{ item.chambre_linked.nom }}</b
        >.<br />
        Cette entrée est effectuée à partir de la réservation
        <b>{{ item.code }}</b>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="dialog = false">ANNULER</v-btn>
        <v-btn color="success" text @click="attribuate">CONFIRMER</v-btn>
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
    attribuate() {
      const postData = {
        entree: this.item.entree,
        sortie: this.item.sortie,
        accompagnants: this.item.accompagnants,
        destination: this.item.destination,
        reservation: this.item.id,
        remise: this.item.remise,
        chambre: this.item.chambre,
        client: this.item.client,
        prix: this.item.chambre_linked.prix_vente,
      }
      this.$axios
        .post('reception/attributions/new', postData)
        .then((result) => {
          const { message } = result.data
          this.$notifier.show({ text: message, variant: 'success' })
          this.dialog = false
          this.$emit('reservation-converted')
        })
    },
    // closeDelete() {
    //   this.dialog = false
    // },
  },
}
</script>

<style></style>
