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
        Voulez vous réelement supprimer le cocktail
        <b>{{ item.nom }}</b
        ><br />
        code: <b>{{ item.code }}</b>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-4" text @click="dialog = false">Cancel</v-btn>
        <v-btn color="blue darken-4" text @click="deleteItemConfirm(item.id)"
          >OK</v-btn
        >
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
      dialog: false,
    }
  },
  methods: {
    ...mapActions('cocktail', ['trash']),
    deleteItemConfirm(id) {
      this.trash(id)
      this.dialog = false
    },
  },
}
</script>

<style></style>
