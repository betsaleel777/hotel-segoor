<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-if="floatingButton" #activator="{ on, attrs }">
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
    <template v-else #activator="{ on, attrs }">
      <v-btn
        dark
        color="primary"
        elevation="4"
        fab
        small
        v-bind="attrs"
        v-on="on"
        ><v-icon dark>mdi-plus</v-icon></v-btn
      >
    </template>
    <v-card>
      <v-card-title>
        <span class="headline primary--text">Créer client</span>
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
                ></v-text-field>
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
                ></v-text-field>
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
                  :error="errors.pere.exist"
                  :error-messages="errors.pere.message"
                  dense
                  outlined
                  label="Nom complet du père"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="client.mere"
                  :error="errors.mere.exist"
                  :error-messages="errors.mere.message"
                  dense
                  outlined
                  label="Nom complet du mère"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="client.pays"
                  :error="errors.pays.exist"
                  :error-messages="errors.pays.message"
                  label="Pays d'origine"
                  required
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-menu
                  ref="menu1"
                  v-model="menu1"
                  :close-on-content-click="false"
                  :return-value.sync="client.naissance"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="client.naissance"
                      :error="errors.naissance.exist"
                      :error-messages="errors.naissance.message"
                      label="Date de Naissance"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="client.naissance" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu1 = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu1.save(client.naissance)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="client.domicile"
                  :error="errors.domicile.exist"
                  :error-messages="errors.domicile.message"
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
                  :error="errors.profession.exist"
                  :error-messages="errors.profession.message"
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
                  <v-radio label="CNI" color="primary" value="cni"></v-radio>
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
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-menu
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  :return-value.sync="piece.delivre_le"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="piece.delivre_le"
                      :error="errors.delivre_le.exist"
                      :error-messages="errors.delivre_le.message"
                      label="Délivré le"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="piece.delivre_le" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu2 = false">
                      Cancel
                    </v-btn>
                    <v-btn-btn
                      text
                      color="primary"
                      @click="$refs.menu2.save(piece.delivre_le)"
                    >
                      OK
                    </v-btn-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-menu
                  ref="menu3"
                  v-model="menu3"
                  :close-on-content-click="false"
                  :return-value.sync="piece.expire_le"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="piece.expire_le"
                      :error="errors.expire_le.exist"
                      :error-messages="errors.expire_le.message"
                      label="Expire le"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="piece.expire_le" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu3 = false">
                      Cancel
                    </v-btn>
                    <v-btn-btn
                      text
                      color="primary"
                      @click="$refs.menu3.save(piece.expire_le)"
                    >
                      OK
                    </v-btn-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="piece.lieu_piece"
                  :error="errors.lieu_piece.exist"
                  :error-messages="errors.lieu_piece.message"
                  outlined
                  dense
                  label="à ..."
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="piece.maker"
                  :error="errors.maker.exist"
                  :error-messages="errors.maker.message"
                  outlined
                  dense
                  label="Par ..."
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-menu
                  ref="menu4"
                  v-model="menu4"
                  :close-on-content-click="false"
                  :return-value.sync="piece.entree_pays"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="piece.entree_pays"
                      :error="errors.entree_pays.exist"
                      :error-messages="errors.entree_pays.message"
                      label="Date d'entrée dans le pays"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="piece.entree_pays"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu4 = false">
                      Cancel
                    </v-btn>
                    <v-btn-btn
                      text
                      color="primary"
                      @click="$refs.menu4.save(piece.entree_pays)"
                    >
                      OK
                    </v-btn-btn>
                  </v-date-picker>
                </v-menu>
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
import formPiece from './FormPiece'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'

export default {
  mixins: [formPiece],
  /* eslint-disable camelcase */
  props: {
    floatingButton: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    menu1: false,
    dialog: false,
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
      pere: { exist: false, message: null },
      mere: { exist: false, message: null },
      naissance: { exist: false, message: null },
      pays: { exist: false, message: null },
      domicile: { exist: false, message: null },
      contact: { exist: false, message: null },
      profession: { exist: false, message: null },
    },
  }),
  methods: {
    reinitialise() {
      this.dialog = false
      errorsInitialise(this.errors)
      this.$refs.form.reset()
    },
    save() {
      this.$axios
        .post('api/reception/clients/new', { ...this.client, ...this.piece })
        .then((result) => {
          const { message, client } = result.data
          this.$notifier.show({ text: message, variant: 'success' })
          this.$emit('new-client', client)
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
