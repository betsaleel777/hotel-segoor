<template>
  <v-dialog v-model="dialog" persistent max-width="700px">
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Modifier réparation</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-select
              v-model="reparation.status"
              :items="statuts"
              :disabled="future"
              dense
              outlined
              label="statut de la réparation"
            ></v-select>
            <v-text-field
              v-model="reparation.nom"
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
              v-model="reparation.categorie_id"
              :errors="errors.categorie_id.exist"
              :error-messages="errors.categorie_id.message"
              :items="categories"
              item-value="id"
              item-text="nom"
              dense
              outlined
              :disabled="newCategorieSet"
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
                      label="Date d'reparation"
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
        <v-btn color="primary" text @click="save"> modifier </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
} from 'tiptap-vuetify'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'

export default {
  components: { TiptapVuetify },
  props: {
    categories: {
      type: Array,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
    value: Boolean,
  },
  data() {
    return {
      dialogue: false,
      modal0: false,
      modal1: false,
      modal2: false,
      modal3: false,
      newCategorieSet: false,
      future: null,
      extensions: [
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
        Paragraph,
      ],
      items: ['oui', 'non'],
      statuts: ['en cours', 'incomplete', 'complete'],
      reparation: {
        nom: null,
        entree: null,
        sortie: null,
        description: null,
        jour: null,
        fermeture: null,
        categorie_id: null,
        montant: null,
        id: null,
        reparation_id: null,
        status: null,
      },
      errors: {
        nom: { exist: false, message: null },
        categorie_id: { exist: false, message: null },
        entree: { exist: false, message: null },
        sortie: { exist: false, message: null },
        montant: { exist: false, message: null },
        description: { exist: false, message: null },
        jour: { exist: false, message: null },
      },
    }
  },
  computed: {
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
    this.initialisation()
  },
  methods: {
    ...mapActions('maintenance/reparation', ['modifier']),
    initialisation() {
      this.future = this.$moment().isBefore(this.item.start, 'days')
      const calebasse = Object.assign({}, this.item)
      this.reparation.nom = calebasse.name
      this.reparation.status = calebasse.status
      this.reparation.description = calebasse.description
      this.reparation.montant = calebasse.montant
      this.reparation.jour = this.$moment(calebasse.start).format('YYYY-MM-DD')
      this.reparation.entree = this.$moment(calebasse.start).format('HH:mm')
      this.reparation.sortie = this.$moment(calebasse.end).format('HH:mm')
      this.reparation.categorie_id = calebasse.categorie
      this.reparation.fermeture = calebasse.fermeture
      this.reparation.id = calebasse.id
      this.reparation.reparation_id = calebasse.reparation
    },
    reinitialise() {
      this.initialisation()
      errorsInitialise(this.errors)
      this.dialog = false
    },
    save() {
      this.reparation.entree = `${this.reparation.jour}T${this.reparation.entree}`
      this.reparation.sortie = `${this.reparation.jour}T${this.reparation.sortie}`
      this.modifier(this.reparation)
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
    },
    pushCategorie(id) {
      this.reparation.categorie_id = id
      this.newCategorieSet = true
    },
  },
}
</script>

<style></style>
