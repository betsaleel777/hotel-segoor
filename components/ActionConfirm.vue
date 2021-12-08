<template>
  <v-dialog v-model="dialogue" max-width="500px">
    <template #activator="{ on: dialog }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            elevation="1"
            icon
            fab
            dark
            x-small
            :color="color"
            v-on="{ ...tooltip, ...dialog }"
          >
            <v-icon small> mdi-{{ icon }} </v-icon>
          </v-btn>
        </template>
        <span>{{ tip }}</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="justify-center error--text headline"
        ><div>{{ titre }}</div>
      </v-card-title>
      <v-card-text justify="center" align="center">
        <slot />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="dialogue = false">Fermer</v-btn>
        <v-btn color="primary" text @click="confirm">OK</v-btn>
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
    titre: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    tip: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    dialogue: false,
  }),
  methods: {
    confirm() {
      this.$store.dispatch(this.action, { id: this.item.id }).then((result) => {
        this.$notifier.show({ text: result.message, variant: 'success' })
        this.$emit('action-done')
        this.dialogue = false
      })
    },
  },
}
</script>

<style></style>
