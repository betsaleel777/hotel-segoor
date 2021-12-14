<template>
  <v-dialog v-model="dialogue" persistent max-width="560px">
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
        <span class="headline primary--text">Créer entretien</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-autocomplete
              v-model="entretien.employe_id"
              :items="employes"
              item-value="id"
              item-text="fullname"
              dense
              outlined
            >
              <template #label>
                Employés<span class="red--text"><strong> *</strong></span>
              </template>
            </v-autocomplete>
            <v-autocomplete
              v-model="entretien.chambre_id"
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
            <div v-if="entretien.employe_id && entretien.chambre_id">
              <center>
                <h3 class="text-center">Programme d'entretien</h3>
              </center>
              <v-divider class="mb-5"></v-divider>
              <v-list v-if="entretiens.length > 0" dense>
                <v-list-item v-for="(element, i) in entretiens" :key="i">
                  <v-list-item-content>
                    <v-list-item-title>
                      Le {{ $moment(element.jour).format('ll') }} de
                      {{ element.entree }} à
                      {{ element.sortie }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon color="error" @click="entretiens.splice(i, 1)"
                      ><v-icon>mdi-trash-can-outline</v-icon></v-btn
                    >
                  </v-list-item-action>
                </v-list-item>
              </v-list>
              <v-row>
                <v-col cols="12">
                  <v-dialog
                    ref="dialog1"
                    v-model="modal1"
                    :return-value.sync="instant.jour"
                    persistent
                    width="300px"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="instant.jour"
                        label="Date d'entretien"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        dense
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="instant.jour"
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
                        @click="$refs.dialog1.save(instant.jour)"
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
                    :return-value.sync="instant.entree"
                    persistent
                    width="290px"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="instant.entree"
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
                      v-model="instant.entree"
                      :max="instant.sortie"
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
                        @click="$refs.dialog2.save(instant.entree)"
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
                    :return-value.sync="instant.sortie"
                    persistent
                    width="290px"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="instant.sortie"
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
                      v-model="instant.sortie"
                      :min="instant.entree"
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
                        @click="$refs.dialog3.save(instant.sortie)"
                      >
                        ok
                      </v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-col>
                <v-col cols="12">
                  <v-btn
                    width="100%"
                    outlined
                    color="blue darken-4"
                    @click="add"
                  >
                    <v-icon left>mdi-plus</v-icon>ajouter</v-btn
                  >
                </v-col>
              </v-row>
            </div>
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
import { mapActions } from 'vuex'
export default {
  props: {
    employes: {
      type: Array,
      required: true,
    },
    chambres: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dialogue: false,
      modal1: false,
      modal2: false,
      modal3: false,
      entretiens: [],
      entretien: {
        employe_id: null,
        chambre_id: null,
      },
      instant: {
        jour: null,
        entree: null,
        sortie: null,
      },
    }
  },
  methods: {
    ...mapActions('maintenance/entretien', ['ajouter']),
    reinitialise() {
      this.$refs.form.reset()
      this.entretiens = []
      this.dialogue = false
    },
    save() {
      if (this.entretiens.length === 0) {
        this.$notifier.show({
          text: "Le programme d'entretien ne peut pas être vide",
          variant: 'error',
        })
      } else {
        const dates = this.entretiens.map((entretien) => {
          return {
            entree: `${entretien.jour}T${entretien.entree}`,
            sortie: `${entretien.jour}T${entretien.sortie}`,
          }
        })
        this.ajouter({ ...this.entretien, dates }).then((result) => {
          this.$notifier.show({ text: result.message, variant: 'success' })
          this.reinitialise()
        })
      }
    },
    add() {
      const invalid =
        this.instant.jour && this.instant.entree && this.instant.sortie
      if (!invalid) {
        this.$notifier.show({
          text: "les dates du programme d'entretien ont été mal renseignées",
          variant: 'error',
        })
      } else {
        this.entretiens.push(this.instant)
        this.instant = {
          jour: null,
          entree: null,
          sortie: null,
        }
      }
    },
  },
}
</script>

<style scoped></style>
