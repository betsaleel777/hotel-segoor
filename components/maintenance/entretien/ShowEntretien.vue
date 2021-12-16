<template>
  <v-dialog v-model="dialog" persistent max-width="850px">
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Entretien</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-list>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Employé: </b
                    >{{ item.fullnameEmploye }}</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Chambre: </b
                    >{{ item.nomChambre }}</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="6">
              <v-list>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Date: </b
                    >{{
                      $moment(item.start).format('DD-MM-YYYY')
                    }}</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4"
                      >Heures de travail: </b
                    >de {{ $moment(item.start).format('HH:mm') }} à
                    {{ $moment(item.end).format('HH:mm') }}</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
          <v-alert
            class="my-3"
            text
            outlined
            color="info"
            icon="mdi-checkbox-marked-outline"
          >
            <h4>Observations</h4>
            <v-divider class="my-1 info" style="opacity: 0.22"></v-divider>
            <div>{{ item.description }}</div>
            <v-divider class="my-1 info" style="opacity: 0.22"></v-divider>
            <v-rating
              :value="item.note"
              color="yellow darken-3"
              background-color="grey darken-1"
              empty-icon="$ratingFull"
              readonly
            ></v-rating>
          </v-alert>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="dialog = false"> Fermer </v-btn>
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
}
</script>

<style></style>
