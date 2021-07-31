<template>
  <v-dialog v-model="dialog" persistent max-width="300">
    <v-card>
      <v-card-title class="headline">
        <h6>Confirmer la Modification</h6>
      </v-card-title>
      <v-card-text
        >Voulez vous réelement modifier l'hébergement
        <b>{{ item.code }}</b></v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="close">Fermer</v-btn>
        <v-btn color="green" text @click="edit">Accepter</v-btn>
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
    value: Boolean,
  },
  data: () => ({
    versements: [],
  }),
  computed: {
    dialog: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  methods: {
    close() {
      this.dialog = false
      this.$emit('edit-closed')
    },
    edit() {
      let url = 'reception/attributions/' + this.item.id
      if (this.item.backgroundColor === 'blue') {
        url = 'reception/reservations/' + this.item.id
      }
      this.$axios
        .put(url, { entree: this.item.startStr, sortie: this.item.endStr })
        .then((result) => {
          const { message } = result.data
          this.$notifier.show({ text: message, variant: 'sucess' })
          this.close()
        })
    },
  },
}
</script>

<style></style>
