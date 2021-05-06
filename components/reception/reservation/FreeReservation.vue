<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ on }">
      <v-btn elevation="1" icon fab dark x-small color="error" v-on="on">
        <v-icon small> mdi-home-export-outline </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="justify-center error--text headline"
        ><div>Confirmer annulation</div>
      </v-card-title>
      <v-card-text justify="center" align="center">
        Voulez vous annuler la reservation <b>{{ item.code.toUpperCase() }}</b
        ><br />
        pour le client: <b>{{ item.client.nom }}</b> ?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-4" text @click="closeDelete">Cancel</v-btn>
        <v-btn color="blue darken-4" text @click="freeItemConfirm(item.id)"
          >OK</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// import moment from 'moment'
export default {
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
    freeItemConfirm(id) {
      this.$axios.put('reception/reservations/abort/' + id).then((result) => {
        const { message, reservation } = result.data
        this.$notifier.show({ text: message, variant: 'success' })
        this.closeDelete()
        this.$emit('free-reservation', reservation)
      })
    },
    checkDate(fin) {
      // moment.locale('fr')
      // const now = moment().format('ll')
      // const sortie = moment(fin)
      // return sortie.isAfter(now)
    },
    closeDelete() {
      this.dialog = false
    },
  },
}
</script>

<style></style>
