<template>
  <v-dialog v-model="dialogue" persistent max-width="850px">
    <template #activator="{ on: dialog, attrs }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            :loading="loading"
            v-bind="attrs"
            color="pink"
            elevation="1"
            icon
            fab
            dark
            x-small
            v-on="{ ...tooltip, ...dialog }"
            @click="getItem"
          >
            <v-icon small>mdi-eye</v-icon>
          </v-btn>
        </template>
        <span>visualiser</span>
      </v-tooltip>
    </template>
    <v-card v-if="employe">
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Détails sur employé</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="dialogue = false">
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
                    ><b class="primary--text text--darken-4">Matricule: </b
                    >{{ employe.code }}</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Nom & Prénoms: </b
                    >{{ fullname }}</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Poste: </b
                    >{{ employe.poste }}</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="6">
              <v-list>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Téléphone: </b
                    >{{ employe.telephone }}</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Adresse: </b
                    >{{ employe.adresse }}</v-list-item-title
                  >
                </v-list-item>
                <v-list-item v-if="employe.email">
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Email: </b
                    >{{ employe.email }}</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
          <timeline-employe :key="key" :entretiens="entretiens" />
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="dialogue = false"> Fermer </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TimelineEmploye from './TimelineEmploye.vue'
export default {
  components: { TimelineEmploye },
  provide() {
    return { id: this.id }
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      entretiens: [],
      dialogue: false,
      key: false,
      loading: false,
    }
  },
  computed: {
    ...mapGetters('maintenance/employe', ['employe']),
    fullname() {
      return `${this.employe.nom} ${this.employe.prenom}`
    },
  },
  methods: {
    ...mapActions('maintenance/employe', ['getOne']),
    getItem() {
      this.loading = true
      this.getOne(this.id).then(() => {
        const employe = JSON.parse(JSON.stringify(this.employe))
        this.entretiens = employe.entretiens.sort((a, b) =>
          this.$moment(a.entree).isAfter(b.entree)
        )
        this.key = !this.key
        this.loading = false
      })
    },
  },
}
</script>

<style></style>
