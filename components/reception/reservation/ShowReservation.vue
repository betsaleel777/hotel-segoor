<template>
  <v-dialog v-model="dialogue" persistent max-width="600px">
    <template #activator="{ on: dialog, attrs }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            v-bind="attrs"
            color="pink"
            elevation="1"
            icon
            fab
            dark
            x-small
            v-on="{ ...tooltip, ...dialog }"
          >
            <v-icon small>mdi-eye</v-icon>
          </v-btn>
        </template>
        <span>visualiser</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline primary--text"
          >Détails réservation chambre {{ item.chambre_linked.nom }}</span
        >
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
                  disabled
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
                  item-text="prenom"
                  dense
                  outlined
                  disabled
                >
                  <template #label>
                    Client<span class="red--text"><strong> *</strong></span>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="reservation.destination"
                  dense
                  outlined
                  label="Destination"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="reservation.entree"
                  :error="errors.entree.exist"
                  :error-messages="errors.entree.message"
                  type="date"
                  dense
                  color="indigo"
                  disabled
                >
                  <template #label>
                    Entrée<span class="red--text"><strong> *</strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="reservation.sortie"
                  :error="errors.sortie.exist"
                  :error-messages="errors.sortie.message"
                  type="date"
                  dense
                  color="indigo"
                  disabled
                >
                  <template #label>
                    Sortie <span class="red--text"><strong> *</strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="reservation.chambre"
                  :error="errors.chambre.exist"
                  :error-messages="errors.chambre.message"
                  :items="chambres"
                  item-value="id"
                  item-text="nom"
                  dense
                  outlined
                  label="Chambre"
                  disabled
                >
                </v-autocomplete>
              </v-col>
            </v-row>
            <p>
              <b>Nombre de jour:</b> {{ nombreJour }} jours<br />
              <b>Montant Nuitée:</b> {{ item.prix }} FCFA <br />
              <b>Total à payer:</b> {{ montant }}
            </p>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="dialogue = false"> Fermer </v-btn>
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
  },
  data: () => {
    return {
      dialogue: false,
      chambres: [],
      clients: [],
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
  computed: {
    nombreJour() {
      return this.$moment(this.item.sortie).diff(this.item.entree, 'days')
    },
    montant() {
      return Number(this.nombreJour) * Number(this.item.prix)
    },
  },
  mounted() {
    const { entree, sortie, ...rest } = this.item
    const object = {
      entree: this.$moment(entree).format('YYYY-MM-DD'),
      sortie: this.$moment(sortie).format('YYYY-MM-DD'),
      ...rest,
    }
    this.reservation = Object.assign({}, object)
    this.chambres.push(this.item.chambre_linked)
    this.clients.push(this.item.client_linked)
  },
}
</script>

<style></style>
