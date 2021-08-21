<template>
  <v-dialog v-model="dialogue" persistent max-width="600px">
    <template #activator="{ on: dialog, attrs }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            elevation="1"
            icon
            fab
            dark
            x-small
            color="primary"
            v-bind="attrs"
            v-on="{ ...tooltip, ...dialog }"
          >
            <v-icon small> mdi-pencil </v-icon>
          </v-btn>
        </template>
        <span>modifier</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Modifier le client</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
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
                  required
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
                  required
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
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="client.pere"
                  dense
                  outlined
                  label="Nom complet du père"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="client.mere"
                  dense
                  outlined
                  label="Nom complet du mère"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="client.pays"
                  label="Pays d'origine"
                  required
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
                  required
                >
                  <template #label>
                    Date de Naissance<span class="red--text"
                      ><strong> *</strong></span
                    >
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="client.domicile"
                  dense
                  outlined
                  label="Domicilier à "
                  required
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="client.departement"
                  dense
                  outlined
                  label="Département"
                  required
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
                  required
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
                  required
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="client.profession"
                  dense
                  outlined
                  label="Profession"
                  required
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <h3>Information de la pièce</h3>
                <v-divider></v-divider>
              </v-col>
              <v-col cols="12">
                <v-radio-group
                  v-model="piece.nature"
                  :error="errors.nature.exist"
                  :error-messages="errors.nature.message"
                  row
                >
                  <v-radio label="CNI" color="primary" value="cni">
                    <template #label>
                      CNI<span class="red--text"><strong> *</strong></span>
                    </template>
                  </v-radio>
                  <v-radio label="Passeport" color="primary" value="passeport">
                    <template #label>
                      Passeport<span class="red--text"
                        ><strong> *</strong></span
                      >
                    </template>
                  </v-radio>
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
                >
                  <template #label>
                    Numéro <span class="red--text"><strong> *</strong></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="piece.delivre_le"
                  label="Délivré le"
                  type="date"
                  required
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="piece.expire_le"
                  label="Expire le"
                  type="date"
                  required
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="piece.lieu_piece"
                  outlined
                  dense
                  label="à ..."
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="piece.maker"
                  outlined
                  dense
                  label="Par ..."
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="piece.entree_pays"
                  label="Date d'entrée dans le pays"
                  type="date"
                  required
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
        <v-btn color="primary" text @click="save"> modifier </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import formPiece from './FormPiece'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'

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
      nom: '',
      prenom: '',
      pere: '',
      mere: '',
      naissance: '',
      pays: '',
      departement: '',
      jeune_fille: '',
      domicile: '',
      email: '',
      contact: '',
      profession: '',
    },
    errors: {
      nom: { exist: false, message: null },
      prenom: { exist: false, message: null },
      naissance: { exist: false, message: null },
      contact: { exist: false, message: null },
    },
  }),
  mounted() {
    this.client = Object.assign({}, this.item)
    this.piece = this.chambre = Object.assign({}, this.item.piece)
  },
  methods: {
    reinitialise() {
      this.client = Object.assign({}, this.item)
      this.piece = this.chambre = Object.assign({}, this.item.piece)
      errorsInitialise(this.errors)
      this.dialogue = false
    },
    save() {
      this.$axios
        .put('reception/clients/' + this.item.id, {
          ...this.client,
          ...this.piece,
        })
        .then((result) => {
          const { message, client } = result.data
          if (Object.keys(client).length > 0) {
            this.$notifier.show({ text: message, variant: 'success' })
            this.$emit('edited-client', client)
          }
          this.reinitialise()
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
