<template>
  <v-tooltip top>
    <template #activator="{ on: tooltip }">
      <v-btn
        fab
        dark
        small
        color="primary"
        class="mx-1"
        elevation="4"
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
    reparations: {
      type: Array,
      required: true,
    },
  },
  methods: {
    print() {
      const reparations = this.reparations.map((reparation) => {
        return {
          nom: reparation.name,
          jour: this.$moment(reparation.start).format('DD-MM-YYYY'),
          start: this.$moment(reparation.start).format('HH:mm'),
          end: this.$moment(reparation.end).format('HH:mm'),
          chambre: reparation.nomChambre,
          provider: reparation.fullnameProvider,
        }
      })
      printjs({
        printable: reparations,
        properties: [
          { field: 'nom', displayName: 'Titre' },
          { field: 'jour', displayName: 'Date' },
          { field: 'start', displayName: 'Réparation' },
          { field: 'end', displayName: 'Fin' },
          { field: 'chambre', displayName: 'Chambre' },
          { field: 'provider', displayName: 'Fournisseur' },
        ],
        type: 'json',
        header: `<center><h3>Liste des Réparations</h3>${this.$moment().format(
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
