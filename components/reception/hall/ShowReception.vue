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
          >Détail de l'hébergement {{ item.chambre_linked.nom }}
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
              <v-col cols="6">
                <v-autocomplete
                  v-model="attribution.client"
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
              <v-col cols="6">
                <v-text-field
                  v-model="attribution.sortie"
                  type="date"
                  dense
                  color="indigo"
                >
                  <template #label>
                    Sortie <span class="red--text"><strong> *</strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  v-model="attribution.chambre"
                  :items="chambresLocales"
                  item-value="id"
                  item-text="nom"
                  dense
                  outlined
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
        <v-btn color="error" text @click="reinitialise"> Fermer </v-btn>
        <v-btn color="primary" text @click="save"> Modifier </v-btn>
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
    this.attribution = Object.assign({}, object)
    this.chambres.push(this.item.chambre_linked)
    this.clients.push(this.item.client_linked)
  },
  methods: {},
}
</script>

<style></style>
