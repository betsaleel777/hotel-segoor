<template lang="html">
  <v-dialog v-model="dialog" persistent max-width="375px">
    <v-card>
      <v-card-title class="text-h6 primary--text text--darken-3">
        Observations au sujet de l'entretien
      </v-card-title>
      <v-card-text>
        <v-textarea
          v-model="post.description"
          outlined
          label="Remarques"
          :errors="errors.description.exist"
          :error-messages="errors.description.message"
        ></v-textarea>
        <div class="text-center mt-5">
          <v-rating
            v-model="post.valeur"
            color="yellow darken-3"
            background-color="grey darken-1"
            empty-icon="$ratingFull"
            half-increments
            hover
            large
          ></v-rating>
          <p v-if="errors.valeur.exist" class="error--text">
            {{ errors.valeur.message }}
          </p>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-space-between">
        <v-btn color="error" text @click="close"> Fermer </v-btn>
        <v-btn color="primary" text @click="save"> valider </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions } from 'vuex'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'
export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    value: Boolean,
  },
  data: () => ({
    post: {
      id: null,
      valeur: null,
      description: null,
    },
    errors: {
      valeur: { exist: false, message: null },
      description: { exist: false, message: null },
    },
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
    ...mapActions('maintenance/entretien', ['modifier']),
    save() {
      this.post.id = this.id
      this.modifier(this.post)
        .then((result) => {
          this.$notifier.show({ text: result.message, variant: 'success' })
          this.$emit('finished')
          this.dialog = false
        })
        .catch((err) => {
          const { data } = err.response
          if (data) {
            errorsInitialise(this.errors)
            errorsWriting(data, this.errors)
          }
        })
    },
    close() {
      this.dialog = false
      this.$emit('closed')
    },
  },
}
</script>
<style lang=""></style>
