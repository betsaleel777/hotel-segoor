<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="dates"
    persistent
    width="450px"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="dates"
        :label="label"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        dense
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="dates"
      locale="fr"
      type="date"
      :range="range"
      full-width
    >
      <v-spacer></v-spacer>
      <v-btn text color="error" @click="modal = false"> Fermer </v-btn>
      <v-btn v-if="range" text color="primary" @click="$refs.dialog.save([])"
        >Effacer</v-btn
      >
      <v-btn v-else text color="primary" @click="$refs.dialog.save('')"
        >Effacer</v-btn
      >
      <v-btn text color="primary" @click="$refs.dialog.save(dates)">
        Valider
      </v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    range: {
      type: Boolean,
      required: true,
    },
    value: {
      type: [Array, String],
      required: true,
    },
  },
  data() {
    return {
      menu: false,
      modal: false,
    }
  },
  computed: {
    dates: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  methods: {},
}
</script>

<style></style>
