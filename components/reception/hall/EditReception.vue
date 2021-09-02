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
        <span class="headline primary--text"
          >Modifier Hébergement chambre {{ item.chambre_linked.nom }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="attribution.accompagnants"
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
                  v-model="attribution.client"
                  :error="errors.client.exist"
                  :error-messages="errors.client.message"
                  :items="clients"
                  item-value="id"
                  item-text="fullname"
                  dense
                  outlined
                >
                  <template #label>
                    Client<span class="red--text"><strong> *</strong></span>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="1">
                <create-client />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="attribution.destination"
                  dense
                  outlined
                  label="Destination"
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
                      :disabled="rechercher"
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
                  :disabled="rechercher"
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
        <v-btn color="primary" text @click="save"> Modifier </v-btn>
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
    item: {
      type: Object,
      required: true,
    },
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
      dialogue: false,
      chambresLocales: [],
      reservation: null,
      messageChambre: '',
      reservations: [],
      rechercher: false,
      attribution: {
        entree: null,
        sortie: null,
        status: null,
        accompagnants: null,
        remise: 0,
        client: null,
        chambre: null,
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
    this.initialisation()
  },
  methods: {
    ...mapActions('reception/attribution', ['modifier']),
    initialisation() {
      const { entree, sortie, ...rest } = this.item
      const object = {
        entree: this.$moment(entree).format('YYYY-MM-DD'),
        sortie: this.$moment(sortie).format('YYYY-MM-DD'),
        ...rest,
      }
      this.attribution = Object.assign({}, object)
      this.chambresLocales.push(rest.chambre_linked)
    },
    fieldComplete() {
      this.attribution.client = this.reservation.client
      this.attribution.accompagnants = this.reservation.accompagnants
      this.attribution.entree = this.reservation.entree
      this.attribution.sortie = this.reservation.sortie
      this.attribution.destination = this.reservation.destination
      this.attribution.chambre = this.reservation.chambre
      this.chambresLocales.push(this.reservation.chambre_linked)
      this.rechercher = true
    },
    reinitialise() {
      errorsInitialise(this.errors)
      this.initialisation()
      this.dialogue = false
    },
    save() {
      if (this.canEdit()) {
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
          this.modifier({ id: this.item.id, ...this.attribution })
            .then((result) => {
              this.$notifier.show({ text: result.message, variant: 'success' })
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
      } else {
        this.$notifier.show({
          text:
            'chevauchement détecté avec un autre hébergement, veuillez modifier la date',
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
    canEdit() {
      let editable = true
      let hebergements = this.hebergements.filter(
        (hebergement) => hebergement.chambre === this.attribution.chambre
      )
      hebergements = hebergements.filter(
        (hebergement) => hebergement.id !== this.attribution.id
      )
      const entree = this.$moment(this.attribution.entree)
      const sortie = this.$moment(this.attribution.sortie)
      const intervalAttribution = moment.range(entree, sortie)
      hebergements.every((hebergement) => {
        const intervalHebergement = moment.range(
          this.$moment(hebergement.entree),
          this.$moment(hebergement.sortie)
        )
        if (intervalAttribution.overlaps(intervalHebergement)) {
          editable = false
          return false
        }
        return true
      })
      return editable
    },
    filtreChambre() {
      const intervalAttribution = moment.range(
        this.$moment(this.attribution.entree),
        this.$moment(this.attribution.sortie)
      )
      const chambresUtilisees = []
      const hebergements = this.hebergements.filter(
        (hebergement) => hebergement.id !== this.attribution.id
      )
      hebergements.forEach((hebergement) => {
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
  },
}
</script>

<style></style>
