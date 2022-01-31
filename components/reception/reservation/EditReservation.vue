<template>
  <v-dialog v-model="dialogue" persistent max-width="600px">
    <template #activator="{ on: dialog, attrs }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            v-bind="attrs"
            color="primary"
            elevation="1"
            icon
            fab
            dark
            x-small
            v-on="{ ...tooltip, ...dialog }"
          >
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <span>modifier</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline primary--text">Modifier réservation chambre</span>
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
              <v-col cols="6">
                <v-autocomplete
                  v-model="reservation.client"
                  :error="errors.client.exist"
                  :error-messages="errors.client.message"
                  :items="clients"
                  item-value="id"
                  item-text="fullname"
                  dense
                  outlined
                  :disabled="newClient"
                  :append-outer-icon="'mdi-plus-thick'"
                  @click:append-outer="openClient = true"
                >
                  <template #label>
                    Client<span class="red--text"><strong> *</strong></span>
                  </template>
                </v-autocomplete>
              </v-col>
              <create-client v-model="openClient" @new-client="pushClient" />
              <v-col cols="12">
                <v-text-field
                  v-model="reservation.destination"
                  dense
                  outlined
                  label="Destination"
                ></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="reservation.entree"
                  :error="errors.entree.exist"
                  :error-messages="errors.entree.message"
                  type="date"
                  dense
                  color="indigo"
                >
                  <template #label>
                    Entrée<span class="red--text"><strong> *</strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="reservation.sortie"
                  :error="errors.sortie.exist"
                  :error-messages="errors.sortie.message"
                  type="date"
                  dense
                  color="indigo"
                >
                  <template #label>
                    Sortie <span class="red--text"><strong> *</strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="2">
                <v-tooltip color="indigo" top>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      :disabled="!filtrable"
                      v-bind="attrs"
                      color="indigo"
                      text
                      dark
                      v-on="on"
                      @click="filtrer"
                    >
                      ....<v-icon center>mdi-home-search</v-icon>
                    </v-btn>
                  </template>
                  <span>Recherche de chambres</span>
                </v-tooltip>
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
                  :hint="messageChambre"
                  label="Chambre"
                  @change="getPrix"
                >
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="reinitialise"> Fermer </v-btn>
        <v-btn color="primary" text @click="save"> Modifier </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/* eslint-disable no-unused-vars */
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { mapActions } from 'vuex'
import CreateClient from '~/components/reception/client/CreateClientDialog.vue'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'
const moment = extendMoment(Moment)

export default {
  components: { CreateClient },
  props: {
    item: {
      type: Object,
      required: true,
    },
    clients: {
      type: Array,
      required: true,
    },
    chambres: {
      type: Array,
      required: true,
    },
    hebergements: {
      type: Array,
      required: true,
    },
  },
  data: () => {
    return {
      dialogue: false,
      chambresLocales: [],
      messageChambre: '',
      openClient: false,
      newClient: false,
      filtrable: true,
      reservation: {
        entree: null,
        sortie: null,
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
    }
  },
  mounted() {
    this.initialisation()
    if (this.reservation.status === 'par site') {
      this.filtrable = false
      this.chambresLocales = this.chambres.filter(
        (chambre) => chambre.categorie === this.reservation.categorie
      )
    }
  },
  methods: {
    ...mapActions({ modifier: 'reception/reservation/modifier' }),
    initialisation() {
      const { entree, sortie, ...rest } = this.item
      const object = {
        entree: this.$moment(entree).format('YYYY-MM-DD'),
        sortie: this.$moment(sortie).format('YYYY-MM-DD'),
        ...rest,
      }
      this.reservation = Object.assign({}, object)
    },
    reinitialise() {
      errorsInitialise(this.errors)
      this.initialisation()
      this.newClient = false
      this.dialogue = false
    },
    canEdit() {
      let editable = true
      let hebergements = this.hebergements.filter(
        (hebergement) => hebergement.chambre === this.reservation.chambre
      )
      hebergements = hebergements.filter(
        (hebergement) => hebergement.id !== this.reservation.id
      )
      const intervalReservation = moment.range(
        this.$moment(this.reservation.entree),
        this.$moment(this.reservation.sortie)
      )
      hebergements.every((hebergement) => {
        const intervalHebergement = moment.range(
          this.$moment(hebergement.entree),
          this.$moment(hebergement.sortie)
        )
        if (intervalReservation.overlaps(intervalHebergement)) {
          editable = false
          return false
        }
        return true
      })
      return editable
    },
    save() {
      if (!this.canEdit()) {
        this.$notifier.show({
          text:
            'chevauchement détectée avec un autre hébergement, veuillez selectionner la date ou la chambre appropriée.',
          variant: 'error',
        })
      } else if (
        this.$moment(this.reservation.entree).isAfter(
          this.$moment(this.reservation.sortie)
        )
      ) {
        this.$notifier.show({
          text: "Date d'entrée et de sortie incohérentes.",
          variant: 'error',
        })
      } else {
        this.modifier({ id: this.item.id, ...this.reservation })
          .then((result) => {
            this.$notifier.show({ text: result.message, variant: 'success' })
            this.$root.$emit('update-calendar')
            this.dialogue = false
          })
          .catch((err) => {
            const { data } = err.response
            if (data) {
              errorsInitialise(this.errors)
              errorsWriting(data, this.errors)
            }
          })
      }
    },
    getPrix() {
      const chambre = this.chambresLocales.find(
        (chambre) => chambre.id === this.reservation.chambre
      )
      this.messageChambre = `Prix de la chambre: ${chambre.prix_vente} FCFA`
    },
    filtrer() {
      this.reservation.entree && this.reservation.sortie
        ? this.filtreChambre()
        : this.$notifier.show({
            text:
              "selectionner les dates d'entée et de sortie pour la recherche",
            variant: 'warning',
          })
    },
    filtreChambre() {
      const intervalReservation = moment.range(
        this.$moment(this.reservation.entree),
        this.$moment(this.reservation.sortie)
      )
      const chambresUtilisees = []
      const hebergements = this.hebergements.filter(
        (hebergement) => hebergement.id !== this.reservation.id
      )
      hebergements.forEach((hebergement) => {
        const intervalHebergement = moment.range(
          this.$moment(hebergement.entree),
          this.$moment(hebergement.sortie)
        )
        if (intervalReservation.overlaps(intervalHebergement)) {
          chambresUtilisees.push(hebergement.chambre_linked.id)
        }
      })
      this.chambresLocales = this.chambres.filter(
        (chambre) => !chambresUtilisees.includes(chambre.id)
      )
    },
    pushClient(id) {
      this.newClient = true
      this.reservation.client = id
    },
  },
}
</script>

<style></style>
