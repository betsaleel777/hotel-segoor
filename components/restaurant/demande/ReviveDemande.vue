<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ on }">
      <v-btn elevation="1" icon fab dark x-small color="error" v-on="on">
        <v-icon small> mdi-redo </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="justify-center error--text headline"
        ><div>Confirmer la relance</div>
      </v-card-title>
      <v-card-text justify="center" align="center">
        Voulez aller créer une autre demande à partir de celle ci, code:
        <b>{{ item.code }}</b>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-4" text @click="closeRevive">Cancel</v-btn>
        <v-btn color="blue darken-4" text @click="reviveItemConfirm(item.id)"
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
    reviveItemConfirm(id) {
      this.$axios
        .post('stock/demandes/cloner', { ...this.item })
        .then((result) => {
          const { message, demande, old } = result.data
          this.closeRevive()
          this.$notifier.show({ text: message, variant: 'success' })
          this.$emit('revived-demande', demande, old)
        })
    },
    closeRevive() {
      this.dialog = false
    },
  },
}
</script>

<style></style>
