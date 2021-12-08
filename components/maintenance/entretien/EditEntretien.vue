<template>
  <v-dialog v-model="dialog" persistent max-width="560px">
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Modifier entretien</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="reinitialise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-dialog
              ref="dialog1"
              v-model="modal1"
              :return-value.sync="entretien.jour"
              persistent
              width="300px"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="entretien.jour"
                  label="Date d'entretien"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="entretien.jour" locale="fr" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="error" @click="modal1 = false">
                  fermer
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.dialog1.save(entretien.jour)"
                >
                  ok
                </v-btn>
              </v-date-picker>
            </v-dialog>
            <v-dialog
              ref="dialog2"
              v-model="modal2"
              :return-value.sync="entretien.entree"
              persistent
              width="290px"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="entretien.entree"
                  label="Heure de début"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="modal2"
                v-model="entretien.entree"
                :max="entretien.sortie"
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
                  @click="$refs.dialog2.save(entretien.entree)"
                >
                  ok
                </v-btn>
              </v-time-picker>
            </v-dialog>
            <v-dialog
              ref="dialog3"
              v-model="modal3"
              :return-value.sync="entretien.sortie"
              persistent
              width="290px"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="entretien.sortie"
                  label="Heure de fin"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="modal3"
                v-model="entretien.sortie"
                :min="entretien.entree"
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
                  @click="$refs.dialog3.save(entretien.sortie)"
                >
                  ok
                </v-btn>
              </v-time-picker>
            </v-dialog>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="save"> modifier </v-btn>
        <action-confirm
          :item="item"
          tip="archiver"
          titre="Confirmer l'archivage"
          icon="archive-plus"
          color="error"
          action="maintenance/entretien/archiver"
          @action-done="dialog = false"
        >
          Voulez vous archiver l'entretien de la chambre
          <b>{{ item.name.toUpperCase() }}</b>
        </action-confirm>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import ActionConfirm from '~/components/ActionConfirm.vue'
import {
  errorsInitialise,
  errorsWriting,
} from '~/components/helper/errorsHandle'

export default {
  components: { ActionConfirm },
  props: {
    item: {
      type: Object,
      required: true,
    },
    value: Boolean,
  },
  data: () => {
    return {
      modal1: false,
      modal2: false,
      modal3: false,
      entretien: {
        id: null,

        jour: { exist: false, message: null },
        entree: { exist: false, message: null },
        sortie: { exist: false, message: null },
      },
      errors: {
        jour: { exist: false, message: null },
        entree: { exist: false, message: null },
        sortie: { exist: false, message: null },
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
    ...mapActions('maintenance/entretien', ['modifier']),
    initialisation() {
      const calebasse = Object.assign({}, this.item)
      this.entretien.id = calebasse.id
      this.entretien.jour = this.$moment(calebasse.start).format('YYYY-MM-DD')
      this.entretien.entree = this.$moment(calebasse.start).format('HH:mm')
      this.entretien.sortie = this.$moment(calebasse.end).format('HH:mm')
      this.entretien.employe_id = calebasse.employe
      this.entretien.chambre_id = calebasse.chambre
    },
    reinitialise() {
      this.initialisation()
      errorsInitialise(this.errors)
      this.dialog = false
    },
    save() {
      this.entretien.entree = `${this.entretien.jour}T${this.entretien.entree}`
      this.entretien.sortie = `${this.entretien.jour}T${this.entretien.sortie}`
      this.modifier(this.entretien)
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
  },
}
</script>

<style></style>
