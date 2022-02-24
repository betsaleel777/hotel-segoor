<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text"
          >Attribuer la chambre {{ infos.title }}</span
        >
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-5">
        <v-form v-if="possible" ref="form">
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
              <v-col cols="6">
                <v-autocomplete
                  v-model="attribution.client"
                  :error="errors.client.exist"
                  :error-messages="errors.client.message"
                  :items="clients"
                  item-value="id"
                  item-text="fullname"
                  dense
                  outlined
                  label="Client"
                  clearable
                  :disabled="newClient"
                  :append-outer-icon="'mdi-plus-thick'"
                  @click:append-outer="openClient = true"
                >
                  <template #label>
                    Client <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-autocomplete>
              </v-col>
              <create-client v-model="openClient" @new-client="pushClient" />
              <v-col cols="12">
                <v-text-field
                  v-model="attribution.destination"
                  dense
                  outlined
                  label="Destination"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="attribution.entree"
                  :error="errors.entree.exist"
                  :error-messages="errors.entree.message"
                  label="Entrée"
                  type="date"
                  required
                >
                  <template #label>
                    Entrée <span class="red--text"><strong>* </strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="attribution.sortie"
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
              <v-col v-can="'accès remise hébergement'" cols="12">
                <v-text-field
                  v-model="montant"
                  type="number"
                  min="0"
                  suffix="FCFA"
                  dense
                  outlined
                  label="Montant de la Remise"
                >
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
/* eslint-disable no-unused-vars */
import { mapActions, mapGetters } from 'vuex'
import CreateClient from '~/components/reception/client/CreateClientDialog.vue'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'

export default {
  components: { CreateClient },
  props: {
    infos: {
      type: Object,
      required: true,
    },
    value: Boolean,
  },
  data: () => {
    return {
      openClient: false,
      newClient: false,
      message: '',
      possible: true,
      montant: 0,
      attribution: {
        entree: '',
        sortie: '',
        accompagnants: null,
        client: null,
        chambre: null,
        remise: 0,
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
  computed: {
    ...mapGetters('reception/client', ['clients']),
    dialog: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  mounted() {
    this.getAll()
    this.attribution.chambre = this.infos.id
    this.attribution.entree = this.infos.entree
    this.attribution.sortie = this.infos.sortie
    const { possible, message } = this.checkDate()
    this.possible = possible
    this.message = message
  },
  methods: {
    ...mapActions({
      getAll: 'reception/client/getAll',
      getOneChambre: 'parametre/chambre/getOne',
      ajouter: 'reception/attribution/ajouter',
    }),
    reinitialise() {
      errorsInitialise(this.errors)
      this.attribution = {
        entree: '',
        sortie: '',
        accompagnants: null,
        client: null,
        chambre: null,
        remise: 0,
      }
      this.newClient = false
      this.dialog = false
    },
    async save() {
      await this.remiseCalcul()
      this.ajouter(this.attribution)
        .then((result) => {
          this.$notifier.show({ text: result.message, variant: 'success' })
          this.reinitialise()
          this.$emit('new-reception')
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
      const now = this.$moment()
      if (!now.isSame(this.$moment(this.attribution.entree), 'days')) {
        message += `Aucune Attribution de chambre pour des dates antérieures ou ultérieures à aujourd'hui: ${now.format(
          'DD-MM-YYYY'
        )} n'est possible.`
        possible = false
      }
      return { possible, message }
    },
    async remiseCalcul() {
      const requete = await this.getOneChambre(this.attribution.chambre)
      this.attribution.remise = (this.montant / requete.prix_vente) * 100
    },
    pushClient(id) {
      this.newClient = true
      this.attribution.client = id
    },
  },
}
</script>

<style></style>
