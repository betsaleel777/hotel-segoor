<template>
  <v-container fluid mx-1 px-1 fill-height>
    <v-card flat width="100%">
      <v-toolbar flat>
        <v-autocomplete
          v-model="selected"
          :items="equipements"
          :search-input.sync="search"
          item-value="id"
          item-text="nom"
          return-object
          deletable-chips
          multiple
          small-chips
          cache-items
          flat
          outlined
          hide-no-data
          hide-details
          label="Ajouter de nouveaux équipements"
          solo-inverted
        ></v-autocomplete>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          :headers="headers"
          :items="selected"
          :search="search"
          :items-per-page="18"
          no-data-text="Aucun Equipement sélectionné"
        >
          <template #top>
            <v-toolbar flat>
              <v-btn small dark color="primary darken-4" @click="save">
                <v-icon left>mdi-content-save</v-icon>
                enregistrer
              </v-btn>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                label="recherche d'équipement"
                append-icon="mdi-magnify"
                color="indigo"
                single-line
                hide-details
              ></v-text-field>
            </v-toolbar>
          </template>
          <template #[`item.quantite`]="props">
            <v-text-field
              v-model="selected[props.index].quantite"
              single-line
              dense
              color="indigo"
              type="number"
              min="1"
              label="quantité"
            >
            </v-text-field>
          </template>
          <template #[`item.libelle`]="props">
            <v-select
              v-model="selected[props.index].libelle"
              :items="states"
              single-line
              dense
              color="indigo"
              label="libelle"
            >
            </v-select>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
let oldSelected = []
export default {
  props: {
    etat: {
      type: Array,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      selected: [],
      search: '',
      equipements: [],
      states: ['bon', 'passable', 'mauvais'],
      headers: [
        { text: 'Equipements', value: 'nom', width: '60%' },
        {
          text: 'Qte',
          value: 'quantite',
          width: '20%',
          align: 'center',
        },
        {
          text: 'Etat',
          value: 'libelle',
          width: '20%',
          align: 'center',
          sortable: false,
        },
      ],
    }
  },
  computed: {
    ...mapGetters('maintenance/fourniture', ['fournitures']),
  },
  mounted() {
    this.getForunitures().then(() => {
      this.equipements = this.fournitures.map((fourniture) => {
        return { ...fourniture, libelle: null, quantite: 1 }
      })
    })
    this.selected = oldSelected = JSON.parse(JSON.stringify(this.etat))
  },
  methods: {
    ...mapActions({
      getForunitures: 'maintenance/fourniture/getAll',
      ajouter: 'parametre/chambre/setState',
      modifier: 'parametre/chambre/editState',
    }),
    validation() {
      return this.selected.every(
        (equipement) =>
          equipement.libelle !== null && Number(equipement.quantite) !== 0
      )
    },
    save() {
      if (this.validation()) {
        if (oldSelected.length === 0) {
          this.ajouter({
            equipements: this.selected,
            id: this.id,
          }).then((result) => {
            this.$notifier.show({ text: result.message, variant: 'success' })
            this.$emit('new-state')
          })
        } else {
          this.modifier({
            equipements: this.selected,
            id: this.id,
          }).then((result) => {
            this.$notifier.show({ text: result.message, variant: 'success' })
            this.$emit('new-state')
          })
        }
      } else {
        this.$notifier.show({
          text:
            "L'état ou la quantité, d'un ou plusieurs équipements sélectionnés n'a pas été coché.",
          variant: 'error',
        })
      }
    },
  },
}
</script>
<style scoped></style>
