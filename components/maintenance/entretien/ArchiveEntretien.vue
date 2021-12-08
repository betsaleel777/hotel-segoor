<template>
  <v-row>
    <v-col cols="1"></v-col>
    <v-col cols="10">
      <v-data-table
        no-data-text="Aucun entretien archivé"
        :loading="$fetchState.pending"
        loading-text="En chargement ..."
        :headers="headers"
        :items="entretiens"
        :search="search"
        :items-per-page="10"
        ><template #[`top`]>
          <v-toolbar flat>
            <v-btn
              class="ml-2"
              :disabled="entretiens.length === 0"
              color="primary"
              dark
              @click="print"
            >
              <v-icon left>mdi-printer</v-icon>
              IMPRIMER
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="recherche ..."
              single-line
              hide-details
            ></v-text-field>
          </v-toolbar>
        </template>
        <template #[`item.deleted_at`]="{ item }">
          {{ $moment(item.deleted_at).format('ll') }}
        </template>
        <template #[`item.jour`]="{ item }">
          {{ $moment(item.start).format('ll') }}
        </template>
        <template #[`item.start`]="{ item }">
          {{ $moment(item.start).format('HH:mm') }}
        </template>
        <template #[`item.end`]="{ item }">
          {{ $moment(item.end).format('HH:mm') }}
        </template>
        <template #[`item.actions`]="{ item }">
          <action-confirm
            v-can="permissions.restorer"
            :item="item"
            tip="restaurer"
            titre="Confirmer la restauration"
            color="primary"
            icon="archive-arrow-up"
            action="maintenance/entretien/restorer"
          >
            Voulez restaurer l'entretien de la chambre
            <b>{{ item.name.toUpperCase() }}</b>
          </action-confirm>
          <action-confirm
            v-can="permissions.supprimer"
            :item="item"
            tip="supprimer"
            color="error"
            titre="Confirmer la suppression"
            icon="delete"
            action="maintenance/entretien/supprimer"
          >
            Voulez vous réelement supprimer l'entretien de la chambre
            <b>{{ item.name.toUpperCase() }}</b
            >, cette action est irréversible
          </action-confirm>
        </template>
      </v-data-table>
    </v-col>
    <v-col cols="1"></v-col>
  </v-row>
</template>

<script>
import printjs from 'print-js'
import { mapGetters, mapActions } from 'vuex'
import { MaintenanceEntretien } from '~/helper/permissions'
import ActionConfirm from '~/components/ActionConfirm.vue'
export default {
  components: {
    ActionConfirm,
  },
  data() {
    return {
      search: '',
      permissions: MaintenanceEntretien,
      headers: [
        { text: 'Titre', value: 'name', align: 'left' },
        { text: "Date d'entretien", value: 'jour', align: 'center' },
        { text: 'Début', value: 'start' },
        { text: 'Fin', value: 'end' },
        { text: 'Archivé le', value: 'deleted_at', align: 'center' },
        { text: 'Actions', value: 'actions', align: 'right', sortable: false },
      ],
    }
  },
  fetch() {
    this.getTrashed()
  },
  computed: {
    ...mapGetters({ entretiens: 'maintenance/entretien/entretiens' }),
  },
  methods: {
    ...mapActions({ getTrashed: 'maintenance/entretien/getTrashed' }),
    print() {
      const entretiens = this.entretiens.map((entretien) => {
        return {
          name: entretien.name,
          deleted_at: this.$moment(entretien.deleted_at).format('ll'),
          jour: this.$moment(entretien.start).format('DD-MM-YYYY'),
          entree: this.$moment(entretien.start).format('HH:mm'),
          sortie: this.$moment(entretien.end).format('HH:mm'),
        }
      })
      printjs({
        printable: entretiens,
        properties: [
          { field: 'name', displayName: 'Titre' },
          { field: 'jour', displayName: 'Date' },
          { field: 'entree', displayName: 'Début' },
          { field: 'sortie', displayName: 'Fin' },
          { field: 'deleted_at', displayName: 'Archivé le' },
        ],
        type: 'json',
        header: `<center><h3>Entretiens archivés</h3>${this.$moment().format(
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
