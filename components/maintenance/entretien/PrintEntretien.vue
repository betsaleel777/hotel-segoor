<template>
  <v-tooltip top>
    <template #activator="{ on: tooltip }">
      <v-btn
        fab
        dark
        small
        color="primary"
        class="mx-1"
        @click="print"
        v-on="{ ...tooltip }"
      >
        <v-icon small> mdi-printer </v-icon>
      </v-btn>
    </template>
    <span>imprimer</span>
  </v-tooltip>
</template>
<script>
import printjs from 'print-js'
export default {
  props: {
    entretiens: {
      type: Array,
      required: true,
    },
  },
  methods: {
    print() {
      const entretiens = this.entretiens.map((entretien) => {
        return {
          nom: entretien.name,
          jour: this.$moment(entretien.start).format('DD-MM-YYYY'),
          start: this.$moment(entretien.start).format('HH:mm'),
          end: this.$moment(entretien.end).format('HH:mm'),
          chambre: entretien.nomChambre,
          employe: entretien.fullnameEmploye,
        }
      })
      printjs({
        printable: entretiens,
        properties: [
          { field: 'nom', displayName: 'Titre' },
          { field: 'jour', displayName: 'Date' },
          { field: 'start', displayName: 'Entretien' },
          { field: 'end', displayName: 'Fin' },
          { field: 'chambre', displayName: 'Chambre' },
          { field: 'employe', displayName: 'Employe' },
        ],
        type: 'json',
        header: `<center><h3>Liste des entretien</h3>${this.$moment().format(
          'll'
        )}</center><br>`,
        css: [
          'https://cdnjs.cloudflare.com/ajax/libs/vuetify/3.0.0-alpha.11/vuetify.min.css',
        ],
        style: 'td {text-align: center }',
      })
    },
  },
}
</script>
<style></style>
