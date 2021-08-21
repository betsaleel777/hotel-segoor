<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn
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
    </template>
    <v-card>
      <v-card-title>
        <span class="headline primary--text">reserver chambre</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="reservation.accompagnants"
                  type="number"
                  dense
                  outlined
                  label="Accompagnants"
                  min="0"
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
                    @change="getChambresReservation"
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
              <v-col cols="12">
                <v-autocomplete
                  v-model="reservation.chambre"
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
  },
  methods: {
    allowDates(val) {
      return Date.parse(val) > Date.now() - 8.64e7
    },
    getChambresReservation() {
      if (this.reservation.entree && this.reservation.sortie) {
        this.$axios
          .get(
            'gestion-chambre/chambres/reservation/' +
              this.reservation.entree +
              '-' +
              this.reservation.sortie
          )
          .then((result) => {
            const chambres = result.data.chambres.map((chambre) => {
              return {
                id: chambre.id,
                nom: `libelle: ${chambre.nom} ---${chambre.prix_list[0].montant} FCFA`,
              }
            })
            this.chambresLocales = chambres
          })
      }
    },
    reinitialise() {
      errorsInitialise(this.errors)
      this.$refs.form.reset()
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
          const { message, reservation } = result.data
          this.$notifier.show({ text: message, variant: 'success' })
          this.reinitialise()
          this.$emit('new-reservation', reservation)
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
