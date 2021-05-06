<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ on }">
      <v-btn elevation="1" icon fab dark x-small color="error" v-on="on">
        <v-icon small> mdi-delete </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="justify-center error--text headline"
        ><div>Confirmer suppression</div>
      </v-card-title>
      <v-card-text justify="center" align="center">
        Voulez vous réelement supprimer le client
        <b>{{ item.nom.toUpperCase() + ' ' }}</b
        ><b>{{ item.prenom.toUpperCase() }}</b
        ><br />
        code: <b>{{ item.code }}</b>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-4" text @click="closeDelete">Cancel</v-btn>
        <v-btn color="blue darken-4" text @click="deleteItemConfirm(item.id)"
          >OK</v-btn
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
  data: () => {
    return {
      dialog: false,
    }
  },
  methods: {
    deleteItemConfirm(id) {
      this.$axios.delete('reception/clients/' + id).then((result) => {
        const { message, client } = result.data
        this.$notifier.show({ text: message, variant: 'success' })
        this.closeDelete()
        this.$emit('deleted-client', client)
      })
    },
    closeDelete() {
      this.dialog = false
    },
  },
}
</script>

<style></style>
