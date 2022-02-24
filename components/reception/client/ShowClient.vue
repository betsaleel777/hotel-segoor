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
            @click="getItem"
          >
            <v-icon small>mdi-eye</v-icon>
          </v-btn>
        </template>
        <span>visualiser</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Dossier Client</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="dialogue = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-5">
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="client.nom"
                  :error="errors.nom.exist"
                  :error-messages="errors.nom.message"
                  dense
                  outlined
                  label="Nom"
                  readonly
                >
                  <template #label>
                    Nom<span class="red--text"><strong> *</strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="client.prenom"
                  :error="errors.prenom.exist"
                  :error-messages="errors.prenom.message"
                  dense
                  outlined
                  label="Prenom"
                  readonly
                >
                  <template #label>
                    Prenom<span class="red--text"><strong> *</strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="client.jeune_fille"
                  dense
                  outlined
                  label="Nom de jeune fille"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="client.pere"
                  dense
                  outlined
                  label="Nom complet du père"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="client.mere"
                  dense
                  outlined
                  label="Nom complet de la mère"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="client.pays"
                  label="Pays d'origine"
                  readonly
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="client.naissance"
                  :error="errors.naissance.exist"
                  :error-messages="errors.naissance.message"
                  label="Date de Naissance"
                  type="date"
                  readonly
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="client.domicile"
                  dense
                  outlined
                  label="Domicilier à "
                  readonly
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="client.departement"
                  dense
                  outlined
                  label="Département"
                  readonly
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="client.contact"
                  :error="errors.contact.exist"
                  :error-messages="errors.contact.message"
                  dense
                  outlined
                  label="Téléphone"
                  readonly
                >
                  <template #label>
                    Téléphone <span class="red--text"><strong> *</strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="client.email"
                  dense
                  outlined
                  label="Email"
                  readonly
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="client.profession"
                  dense
                  outlined
                  label="Profession"
                  readonly
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row v-if="piece">
              <v-col cols="12">
                <h6>Information de la pièce</h6>
                <v-divider></v-divider>
              </v-col>
              <v-col cols="12">
                <v-radio-group
                  v-model="piece.nature"
                  :error="errors.nature.exist"
                  :error-messages="errors.nature.message"
                  row
                  readonly
                >
                  <v-radio label="CNI" color="primary" value="cni"> </v-radio>
                  <v-radio
                    label="Passeport"
                    color="primary"
                    value="passeport"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="piece.numero_piece"
                  :error="errors.numero_piece.exist"
                  :error-messages="errors.numero_piece.message"
                  dense
                  outlined
                  label="Numéro"
                  readonly
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="piece.delivre_le"
                  label="Délivré le"
                  type="date"
                  readonly
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="piece.expire_le"
                  label="Expire le"
                  type="date"
                  readonly
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="piece.lieu_piece"
                  outlined
                  dense
                  label="à ..."
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="piece.maker"
                  outlined
                  dense
                  label="Par ..."
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="piece.entree_pays"
                  label="Date d'entrée dans le pays"
                  type="date"
                  readonly
                >
                </v-text-field>
              </v-col>
            </v-row>
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
import { mapActions } from 'vuex'
import formPiece from './FormPiece'
export default {
  mixins: [formPiece],
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialogue: false,
    client: {
      nom: null,
      prenom: null,
      pere: null,
      mere: null,
      naissance: null,
      pays: null,
      departement: null,
      jeune_fille: null,
      domicile: null,
      email: null,
      contact: null,
      profession: null,
    },
    errors: {
      nom: { exist: false, message: null },
      prenom: { exist: false, message: null },
      naissance: { exist: false, message: null },
      contact: { exist: false, message: null },
    },
  }),
  mounted() {
    const { piece, ...rest } = this.item
    this.client = rest
    this.piece = piece
  },
  methods: {
    ...mapActions('reception/client', ['getOne']),
    getItem() {
      this.getOne(this.item.id).then((client) => {
        const { piece, ...rest } = client
        this.client = rest
        this.piece = piece
      })
    },
  },
}
</script>

<style></style>
