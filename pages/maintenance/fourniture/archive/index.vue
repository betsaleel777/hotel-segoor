<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Equipements
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="2">
              <side-maintenance />
            </v-col>
            <v-col cols="12" sm="6" md="10">
              <v-data-table
                no-data-text="Aucun équipement archivé"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="fournitures"
                :search="search"
                :items-per-page="10"
                ><template #[`top`]>
                  <v-toolbar flat>
                    <v-btn
                      class="ml-2"
                      color="primary"
                      dark
                      :to="`/maintenance/fourniture/`"
                    >
                      <v-icon left>mdi-arrow-left-thick</v-icon>
                      retour
                    </v-btn>
                    <v-btn
                      class="ml-2"
                      :disabled="fournitures.length === 0"
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
                <template #[`item.actions`]="{ item }">
                  <action-confirm
                    v-can="permissions.restorer"
                    :item="item"
                    tip="restaurer"
                    titre="Confirmer la restauration"
                    color="primary"
                    icon="archive-arrow-up"
                    action="maintenance/fourniture/restorer"
                  >
                    Voulez restaurer l'équipement
                    <b>{{ item.nom.toUpperCase() }}</b>
                  </action-confirm>
                  <action-confirm
                    v-can="permissions.supprimer"
                    :item="item"
                    tip="supprimer"
                    color="error"
                    titre="Confirmer la suppression"
                    icon="delete"
                    action="maintenance/fourniture/supprimer"
                  >
                    Voulez vous réelement supprimer l'équipement
                    <b>{{ item.nom.toUpperCase() }}</b
                    >, cette action est irréversible
                  </action-confirm>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions></v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import printjs from 'print-js'
import { mapGetters, mapActions } from 'vuex'
import { MaintenanceEquipement } from '~/helper/permissions'
import ActionConfirm from '~/components/ActionConfirm.vue'
import SideMaintenance from '~/components/maintenance/SideMaintenance.vue'
export default {
  components: {
    ActionConfirm,
    SideMaintenance,
  },
  data() {
    return {
      search: '',
      permissions: MaintenanceEquipement,
      headers: [
        { text: 'Nom', value: 'nom' },
        { text: 'Archivé le', value: 'deleted_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  fetch() {
    this.getTrashed()
  },
  computed: {
    ...mapGetters('maintenance/fourniture', ['fournitures']),
  },
  methods: {
    ...mapActions('maintenance/fourniture', ['getTrashed']),
    print() {
      printjs({
        printable: this.fournitures,
        properties: [
          { field: 'code', displayName: 'Code' },
          { field: 'nom', displayName: 'Nom' },
          { field: 'description', displayName: 'Description' },
        ],
        type: 'json',
        header: `<center><h3>Article archivé</h3>${this.$moment().format(
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
