<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" color="green darken-1" text v-on="on">
        reserver
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text"
          >Reserver chambre {{ infos.title }}</span
        >
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form v-if="possible" ref="form">
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="reservation.accompagnants"
                  type="number"
                  dense
                  outlined
                  label="Accompagnants"
                >
                </v-text-field>
              </v-col>
              <v-col cols="5">
                <v-autocomplete
                  v-model="reservation.client"
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
                  v-model="reservation.destination"
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
                  :return-value.sync="reservation.entree"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="reservation.entree"
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
                    v-model="reservation.entree"
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
                      @click="$refs.menu1.save(reservation.entree)"
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
                  :return-value.sync="reservation.sortie"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="reservation.sortie"
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
                    v-model="reservation.sortie"
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
                      @click="$refs.menu2.save(reservation.sortie)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-alert
          v-else
          icon="mdi-shield-lock-outline"
          prominent
          text
          type="info"
        >
          {{ message }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="reinitialise"> Fermer </v-btn>
        <v-btn color="primary" text @click="save"> Créer </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment'
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
    infos: {
      type: Object,
      required: true,
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
      message: '',
      possible: true,
      reservation: Object.assign({}, defaultForm),
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
    this.reservation.chambre = this.infos.id
    this.reservation.entree = this.infos.entree
    this.reservation.sortie = this.infos.sortie
    const { possible, message } = this.checkDate()
    this.possible = possible
    this.message = message
  },
  methods: {
    allowDates(val) {
      return Date.parse(val) > Date.now() - 8.64e7
    },
    reinitialise() {
      errorsInitialise(this.errors)
      // eslint-disable-next-line no-unused-expressions
      // this.possible ? this.$refs.form.reset() : null
      this.dialog = false
    },
    pushClient(client) {
      this.clientsLocales.push(client)
    },
    save() {
      this.$axios
        .post('reception/reservations/new', { ...this.reservation })
        .then((result) => {
          this.$notifier.show({ text: result.data.message, variant: 'success' })
          this.dialog = false
          this.$emit('new-reservation')
        })
        .catch((err) => {
          const { data } = err.response
          if (data) {
            errorsInitialise(this.errors)
            errorsWriting(data, this.errors)
          }
        })
    },
    checkDate() {
      let message = ''
      let possible = true
      const start = moment(this.reservation.entree)
      if (moment().isAfter(start)) {
        message += `Aucune Réservation n'est possible pour cette date.`
        possible = false
      }
      return { possible, message }
    },
  },
}
</script>

<style></style>
