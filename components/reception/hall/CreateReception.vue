<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn
        v-if="floating"
        v-bind="attrs"
        color="primary"
        dark
        absolute
        bottom
        right
        fab
        v-on="on"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn v-else v-bind="attrs" dark color="primary" v-on="on">
        <v-icon small>mdi-plus</v-icon>
        AJOUTER
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline primary--text">attribuer une chambre</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="attribution.reservation"
                  :items="reservations"
                  item-value="id"
                  item-text="nom"
                  dense
                  outlined
                  label="Réservation"
                  required
                  @change="fieldComplete"
                ></v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="attribution.accompagnants"
                  type="number"
                  dense
                  outlined
                  label="Accompagnants"
                >
                </v-text-field>
              </v-col>
              <v-col cols="5">
                <v-autocomplete
                  v-model="attribution.client"
                  :error="errors.client.exist"
                  :error-messages="errors.client.message"
                  :items="clientsLocales"
                  item-value="id"
                  item-text="nom"
                  dense
                  outlined
                  label="Client"
                  required
                ></v-autocomplete>
              </v-col>
              <v-col cols="1">
                <create-client @new-client="pushClient" />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="attribution.destination"
                  dense
                  outlined
                  label="Destination"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-menu
                  ref="menu1"
                  v-model="menu1"
                  :close-on-content-click="false"
                  :return-value.sync="attribution.entree"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="attribution.entree"
                      :error="errors.entree.exist"
                      :error-messages="errors.entree.message"
                      label="Debut"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="attribution.entree"
                    :allowed-dates="allowDates"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu1 = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu1.save(attribution.entree)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-menu
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  :return-value.sync="attribution.sortie"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="attribution.sortie"
                      :error="errors.sortie.exist"
                      :error-messages="errors.sortie.message"
                      label="Fin"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="attribution.sortie"
                    :allowed-dates="allowDates"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu2 = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu2.save(attribution.sortie)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="attribution.chambre"
                  :error="errors.chambre.exist"
                  :error-messages="errors.chambre.message"
                  :items="chambresLocales"
                  item-value="id"
                  item-text="nom"
                  dense
                  outlined
                  label="Chambre"
                  required
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="reinitialise"> Fermer </v-btn>
        <v-btn color="blue darken-1" text @click="save"> Créer </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import CreateClient from '../client/CreateClient.vue'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'

export default {
  components: { CreateClient },
  props: {
    clients: {
      type: Array,
      required: true,
    },
    reservations: {
      type: Array,
      required: true,
    },
    chambres: {
      type: Array,
      required: true,
    },
    floating: {
      type: Boolean,
      default: true,
    },
  },
  data: () => {
    const bodyError = { exist: false, message: null }
    const defaultForm = Object.freeze({
      entree: '',
      sortie: '',
      status: null,
      accompagnants: null,
      client: null,
      chambre: null,
    })
    return {
      dialog: false,
      menu1: false,
      menu2: false,
      chambresLocales: [],
      attribution: Object.assign({}, defaultForm),
      errors: {
        entree: bodyError,
        sortie: bodyError,
        status: bodyError,
        client: bodyError,
        chambre: bodyError,
      },
      clientsLocales: [],
    }
  },
  beforeUpdate() {
    this.clientsLocales = this.clients
    this.chambresLocales = this.chambres
  },
  methods: {
    allowDates(val) {
      return Date.parse(val) > Date.now() - 8.64e7
    },
    fieldComplete() {
      this.$axios
        .get('reception/reservations/' + this.attribution.reservation)
        .then((result) => {
          const { reservation } = result.data
          this.attribution.client = reservation.client
          this.attribution.accompagnants = reservation.accompagnants
          this.attribution.entree = reservation.entree
          this.attribution.sortie = reservation.sortie
          this.attribution.destination = reservation.destination
          this.attribution.chambre = reservation.chambre
        })
    },
    reinitialise() {
      errorsInitialise(this.errors)
      this.$refs.form.reset()
      this.dialog = false
    },
    pushClient(client) {
      this.clientsLocales.push(client)
    },
    save() {
      this.$axios
        .post('reception/attributions/new', { ...this.attribution })
        .then((result) => {
          const { message, attribution } = result.data
          this.$notifier.show({ text: message, variant: 'success' })
          this.reinitialise()
          this.$emit('new-attribution', attribution)
        })
        .catch((err) => {
          const { data } = err.response
          if (data) {
            errorsInitialise(this.errors)
            errorsWriting(data, this.errors)
          }
        })
    },
  },
}
</script>

<style></style>
