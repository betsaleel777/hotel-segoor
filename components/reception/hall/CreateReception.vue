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
        <v-icon left>mdi-plus-thick</v-icon>
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
                  v-model="reservation"
                  :items="reservations"
                  item-value="id"
                  item-text="libelle"
                  return-object
                  dense
                  outlined
                  label="Réservation"
                  @change="fieldComplete"
                ></v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="attribution.accompagnants"
                  type="number"
                  dense
                  outlined
                  :disabled="modifier"
                  label="Accompagnants"
                  min="0"
                >
                </v-text-field>
              </v-col>
              <v-col cols="5">
                <v-autocomplete
                  v-model="attribution.client"
                  :error="errors.client.exist"
                  :error-messages="errors.client.message"
                  :items="clients"
                  item-value="id"
                  item-text="fullname"
                  :disabled="modifier"
                  dense
                  outlined
                >
                  <template #label>
                    Client<span class="red--text"><strong> *</strong></span>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="1">
                <create-client v-if="!modifier" />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="attribution.destination"
                  dense
                  outlined
                  label="Destination"
                  :disabled="modifier"
                ></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="attribution.entree"
                  :error="errors.entree.exist"
                  :error-messages="errors.entree.message"
                  type="date"
                  disabled
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
                  v-model="attribution.sortie"
                  :error="errors.sortie.exist"
                  :error-messages="errors.sortie.message"
                  type="date"
                  :disabled="modifier"
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
                      v-bind="attrs"
                      color="indigo"
                      :disabled="modifier"
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
              <v-col cols="6">
                <v-autocomplete
                  v-model="attribution.chambre"
                  :error="errors.chambre.exist"
                  :error-messages="errors.chambre.message"
                  :items="chambresLocales"
                  item-value="id"
                  item-text="nom"
                  dense
                  outlined
                  :disabled="modifier"
                  :hint="messageChambre"
                  @change="getPrix"
                >
                  <template #label>
                    Chambre<span class="red--text"><strong> *</strong></span>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="attribution.remise"
                  type="number"
                  min="0"
                  max="100"
                  suffix="%"
                  dense
                  outlined
                  label="Remise"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="reinitialise"> Fermer </v-btn>
        <v-btn color="warning" text @click="reset"> Réinitialiser </v-btn>
        <v-btn color="primary" text @click="save"> Créer </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { mapActions } from 'vuex'
import CreateClient from '../client/CreateClient.vue'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'
const moment = extendMoment(Moment)

export default {
  components: { CreateClient },
  props: {
    clients: {
      type: Array,
      required: true,
    },
    hebergements: {
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
    return {
      dialog: false,
      chambresLocales: [],
      reservation: null,
      messageChambre: '',
      reservations: [],
      modifier: false,
      attribution: {
        entree: null,
        sortie: null,
        status: null,
        accompagnants: null,
        remise: 0,
        client: null,
        chambre: null,
        reservation: null,
      },
      errors: {
        entree: { exist: false, message: null },
        sortie: { exist: false, message: null },
        status: { exist: false, message: null },
        client: { exist: false, message: null },
        chambre: { exist: false, message: null },
        remise: { exist: false, message: null },
      },
    }
  },
  mounted() {
    const reservations = this.hebergements.filter((hebergement) =>
      Object.prototype.hasOwnProperty.call(hebergement, 'date_annulation')
    )
    this.reservations = reservations.map((reservation) => {
      const { entree, sortie, ...rest } = reservation
      return {
        ...rest,
        entree: moment(entree).format('YYYY-MM-DD'),
        sortie: moment(sortie).format('YYYY-MM-DD'),
        libelle: `${rest.client_linked.nom} ${rest.client_linked.prenom}, ${
          rest.chambre_linked.nom
        } ${moment(entree).format('ll')} - ${moment(sortie).format('ll')}`,
      }
    })
    this.attribution.entree = this.$moment().format('YYYY-MM-DD')
  },
  methods: {
    ...mapActions('reception/attribution', ['ajouter']),
    fieldComplete() {
      this.attribution.client = this.reservation.client
      this.attribution.accompagnants = this.reservation.accompagnants
      this.attribution.entree = this.reservation.entree
      this.attribution.sortie = this.reservation.sortie
      this.attribution.destination = this.reservation.destination
      this.attribution.chambre = this.reservation.chambre
      this.chambresLocales.push(this.reservation.chambre_linked)
      this.modifier = true
    },
    reinitialise() {
      errorsInitialise(this.errors)
      this.attribution = {
        entree: null,
        sortie: null,
        status: null,
        accompagnants: null,
        remise: 0,
        client: null,
        chambre: null,
        reservation: null,
      }
      this.dialog = false
    },
    save() {
      if (this.attribution.entree && this.attribution.sortie) {
        const entree = moment(this.attribution.entree)
        const sortie = moment(this.attribution.sortie)
        if (entree.isAfter(sortie, 'days')) {
          this.$notifier.show({
            text: "Date d'entrée et de sortie incohérente",
            variant: 'warning',
          })
        } else if (!moment().isSame(entree, 'days')) {
          this.$notifier.show({
            text: "La date d'entée du client doit être celle d'aujourd'hui.",
            variant: 'warning',
          })
        } else {
          this.attribution.reservation = this.reservation.id
          this.ajouter(this.attribution)
            .then((result) => {
              this.$notifier.show({ text: result.message, variant: 'success' })
              this.reinitialise()
            })
            .catch((err) => {
              const { data } = err.response
              if (data) {
                errorsInitialise(this.errors)
                errorsWriting(data, this.errors)
              }
            })
        }
      } else {
        this.$notifier.show({
          text: 'veuillez remplir correctement les champs',
          variant: 'error',
        })
      }
    },
    getPrix() {
      const chambre = this.chambresLocales.find(
        (chambre) => chambre.id === this.attribution.chambre
      )
      this.messageChambre = `Prix de la chambre: ${chambre.prix_vente} FCFA`
    },
    filtrer() {
      this.attribution.entree && this.attribution.sortie
        ? this.filtreChambre()
        : this.$notifier.show({
            text:
              "selectionner les dates d'entée et de sortie pour la recherche",
            variant: 'warning',
          })
    },
    filtreChambre() {
      const intervalAttribution = moment.range(
        this.$moment(this.attribution.entree),
        this.$moment(this.attribution.sortie)
      )
      const chambresUtilisees = []
      this.hebergements.forEach((hebergement) => {
        const intervalHebergement = moment.range(
          this.$moment(hebergement.entree),
          this.$moment(hebergement.sortie)
        )
        if (intervalAttribution.overlaps(intervalHebergement)) {
          chambresUtilisees.push(hebergement.chambre_linked.id)
        }
      })
      this.chambresLocales = this.chambres.filter(
        (chambre) => !chambresUtilisees.includes(chambre.id)
      )
    },
    reset() {
      this.attribution = {
        entree: null,
        sortie: null,
        status: null,
        accompagnants: null,
        remise: 0,
        client: null,
        chambre: null,
        reservation: null,
      }
      this.reservation = null
      this.modifier = false
      this.chambresLocales = []
    },
  },
}
</script>

<style></style>
