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
        <v-btn color="success" text @click="edit">Accepter</v-btn>
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
    value: Boolean,
  },
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
    ...mapActions({
      editReservation: 'reception/reservation/modifier',
      editAttribution: 'reception/attribution/modifierCalendrier',
    }),
    close() {
      this.dialog = false
      this.$emit('edit-closed')
    },
    edit() {
      const putData = {
        id: this.item.id,
        entree: this.item.startStr,
        sortie: this.item.endStr,
      }
      if (this.item.backgroundColor === '#1E88E5') {
        this.editReservation(putData).then((result) => {
          const { message } = result.data
          this.$notifier.show({ text: message, variant: 'sucess' })
          this.close()
        })
      } else {
        this.editAttribution(putData).then((result) => {
          this.$notifier.show({ text: result.message, variant: 'sucess' })
          this.close()
        })
      }
    },
  },
}
</script>

<style></style>
