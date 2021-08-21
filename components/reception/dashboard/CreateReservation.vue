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
                >
                  <template #label>
                    Client <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-autocomplete>
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
                <v-text-field
                  v-model="reservation.entree"
                  :error="errors.entree.exist"
                  :error-messages="errors.entree.message"
                  label="Entrée"
                  type="date"
                  required
                >
                  <template #label>
                    Entrée<span class="red--text"><strong>* </strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="reservation.sortie"
                  :error="errors.sortie.exist"
                  :error-messages="errors.sortie.message"
                  label="Sortie"
                  type="date"
                  required
                >
                  <template #label>
                    Sortie <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-text-field>
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
          class="mt-10"
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
    return {
      dialog: false,
      message: '',
      possible: true,
      reservation: {
        entree: '',
        sortie: '',
        status: null,
        accompagnants: null,
        client: null,
        chambre: null,
      },
      errors: {
        entree: { exist: false, message: null },
        sortie: { exist: false, message: null },
        status: { exist: false, message: null },
        client: { exist: false, message: null },
        chambre: { exist: false, message: null },
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
      this.reservation = {
        entree: '',
        sortie: '',
        status: null,
        accompagnants: null,
        client: null,
        chambre: null,
      }
      this.dialog = false
    },
    pushClient(client) {
      client.nom = client.nom + ' ' + client.prenom
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
