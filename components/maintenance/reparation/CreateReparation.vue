<template>
  <v-dialog v-model="dialogue" persistent max-width="700px">
    <template #activator="{ on: dialog, attrs }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            v-bind="attrs"
            fab
            dark
            small
            color="primary"
            elevation="4"
            class="mx-1"
            v-on="{ ...tooltip, ...dialog }"
          >
            <v-icon small> mdi-plus-thick </v-icon>
          </v-btn>
        </template>
        <span>ajouter</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Créer réparation</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-autocomplete
              v-model="reparation.incomplete"
              :items="incompletes"
              item-value="reparation"
              item-text="name"
              dense
              outlined
              label="réparations incomplètes"
              @change="preremplissage"
            >
            </v-autocomplete>
            <v-text-field
              v-model="reparation.nom"
              :disabled="orderInputOnly"
              :errors="errors.nom.exist"
              :error-messages="errors.nom.message"
              dense
              outlined
            >
              <template #label>
                Titre de la réparation<span class="red--text"
                  ><strong> *</strong></span
                >
              </template>
            </v-text-field>
            <v-autocomplete
              v-model="reparation.provider_id"
              :errors="errors.provider_id.exist"
              :error-messages="errors.provider_id.message"
              :items="providers"
              item-value="id"
              item-text="fullname"
              dense
              outlined
            >
              <template #label>
                Fournisseurs<span class="red--text"><strong> *</strong></span>
              </template>
            </v-autocomplete>
            <v-autocomplete
              v-model="reparation.chambre_id"
              :disabled="orderInputOnly"
              :errors="errors.chambre_id.exist"
              :error-messages="errors.chambre_id.message"
              :items="chambres"
              item-value="id"
              item-text="nom"
              dense
              outlined
            >
              <template #label>
                Chambres<span class="red--text"><strong> *</strong></span>
              </template>
            </v-autocomplete>
            <v-autocomplete
              v-model="reparation.categorie_id"
              :errors="errors.categorie_id.exist"
              :error-messages="errors.categorie_id.message"
              :items="categories"
              item-value="id"
              item-text="nom"
              dense
              outlined
              :disabled="newCategorieSet || orderInputOnly"
              append-outer-icon="mdi-plus"
              @click:append-outer="modal0 = true"
            >
              <template #label>
                Catégorie<span class="red--text"><strong> *</strong></span>
              </template>
            </v-autocomplete>
            <create-categorie
              v-model="modal0"
              element="reparation"
              @new-categorie="pushCategorie"
            />
            <span v-if="errors.description.exist" class="error--text">
              {{ errors.description.message }}
            </span>
            <tiptap-vuetify
              v-model="reparation.description"
              :card-props="{ flat: true, color: '#F5F5F5' }"
              :toolbar-attributes="{ color: 'primary' }"
              :extensions="extensions"
              placeholder="taches de réparation executées par le fournisseur"
              class="mb-5"
            />
            <v-row>
              <v-col cols="12">
                <v-dialog
                  ref="dialog1"
                  v-model="modal1"
                  :return-value.sync="reparation.jour"
                  persistent
                  width="300px"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="reparation.jour"
                      label="Date de réparation"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      dense
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="reparation.jour"
                    locale="fr"
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="error" @click="modal1 = false">
                      fermer
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog1.save(reparation.jour)"
                    >
                      ok
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>
              <v-col cols="6">
                <v-dialog
                  ref="dialog2"
                  v-model="modal2"
                  :return-value.sync="reparation.entree"
                  persistent
                  width="290px"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="reparation.entree"
                      :errors="errors.entree.exist"
                      :error-messages="errors.entree.message"
                      label="Heure de début"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      dense
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="modal2"
                    v-model="reparation.entree"
                    :max="reparation.sortie"
                    full-width
                    format="24hr"
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="error" @click="modal2 = false">
                      fermer
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog2.save(reparation.entree)"
                    >
                      ok
                    </v-btn>
                  </v-time-picker>
                </v-dialog>
              </v-col>
              <v-col cols="6">
                <v-dialog
                  ref="dialog3"
                  v-model="modal3"
                  :return-value.sync="reparation.sortie"
                  persistent
                  width="290px"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="reparation.sortie"
                      :errors="errors.sortie.exist"
                      :error-messages="errors.sortie.message"
                      label="Heure de fin"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      dense
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="modal3"
                    v-model="reparation.sortie"
                    :min="reparation.entree"
                    full-width
                    format="24hr"
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="error" @click="modal3 = false">
                      fermer
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog3.save(reparation.sortie)"
                    >
                      ok
                    </v-btn>
                  </v-time-picker>
                </v-dialog>
              </v-col>
              <v-col cols="12">
                <v-file-input
                  v-model="reparation.devis"
                  accept="image/*"
                  label="File input"
                  dense
                  counter
                ></v-file-input>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="reparation.fermeture"
                  :items="items"
                  dense
                  outlined
                  label="Chambre fermée pour réparation ?"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="reparation.montant"
                  :errors="errors.montant.exist"
                  :error-messages="errors.montant.message"
                  dense
                  outlined
                >
                  <template #label>
                    Montant de la réparation<span class="red--text"
                      ><strong> *</strong></span
                    >
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
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
import { mapActions, mapGetters } from 'vuex'
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History,
} from 'tiptap-vuetify'
import CreateCategorie from '~/components/CreateCategorie.vue'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'
export default {
  components: { CreateCategorie, TiptapVuetify },
  props: {
    categories: {
      type: Array,
      required: true,
    },
    providers: {
      type: Array,
      required: true,
    },
    chambres: {
      type: Array,
      required: true,
    },
    incompletes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dialogue: false,
      modal0: false,
      modal1: false,
      modal2: false,
      modal3: false,
      newCategorieSet: false,
      items: ['oui', 'non'],
      extensions: [
        History,
        Blockquote,
        Link,
        Underline,
        Strike,
        Italic,
        ListItem,
        BulletList,
        OrderedList,
        [
          Heading,
          {
            options: {
              levels: [1, 2, 3],
            },
          },
        ],
        Bold,
        HorizontalRule,
        Paragraph,
        HardBreak,
      ],
      orderInputOnly: false,
      reparation: {
        incomplete: null,
        nom: null,
        provider_id: null,
        chambre_id: null,
        entree: null,
        sortie: null,
        jour: null,
        description: null,
        fermeture: 'non',
        categorie_id: null,
        montant: null,
        devis: null,
      },
      errors: {
        nom: { exist: false, message: null },
        categorie_id: { exist: false, message: null },
        provider_id: { exist: false, message: null },
        chambre_id: { exist: false, message: null },
        entree: { exist: false, message: null },
        sortie: { exist: false, message: null },
        montant: { exist: false, message: null },
        description: { exist: false, message: null },
        jour: { exist: false, message: null },
      },
    }
  },
  computed: {
    ...mapGetters({ originale: 'maintenance/reparation/reparation' }),
  },
  methods: {
    ...mapActions('maintenance/reparation', ['ajouter', 'getOne']),
    reinitialise() {
      this.$refs.form.reset()
      errorsInitialise(this.errors)
      this.reparation.description = null
      this.reparation.fermeture = 'non'
      this.orderInputOnly = false
      this.newCategorieSet = false
      this.dialogue = false
    },
    save() {
      const old = {
        entree: this.reparation.entree,
        sortie: this.reparation.sortie,
      }
      this.reparation.entree = `${this.reparation.jour}T${this.reparation.entree}`
      this.reparation.sortie = `${this.reparation.jour}T${this.reparation.sortie}`
      this.ajouter(this.reparation)
        .then((result) => {
          this.$notifier.show({ text: result.message, variant: 'success' })
          this.reinitialise()
        })
        .catch((err) => {
          const { data } = err.response
          if (data) {
            this.reparation.entree = old.entree
            this.reparation.sortie = old.sortie
            errorsInitialise(this.errors)
            errorsWriting(data, this.errors)
          }
        })
    },
    pushCategorie(id) {
      this.reparation.categorie_id = id
      this.newCategorieSet = true
    },
    preremplissage() {
      this.getOne(this.reparation.incomplete).then(() => {
        this.reparation.nom = this.originale.nom
        this.reparation.chambre_id = this.originale.chambre.id
        this.reparation.categorie_id = this.originale.categorie.id
        this.orderInputOnly = true
      })
    },
  },
}
</script>

<style scoped></style>
