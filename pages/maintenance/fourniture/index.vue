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
                no-data-text="Aucun équipement"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="fournitures"
                :search="search"
                :items-per-page="10"
                ><template #[`top`]>
                  <v-toolbar flat>
                    <create-fourniture v-can="permissions.creation" />
                    <v-btn
                      class="ml-2"
                      color="primary"
                      dark
                      :to="`/maintenance/fourniture/archive/`"
                      small
                    >
                      <v-icon left>mdi-archive</v-icon>
                      archives
                    </v-btn>
                    <v-btn
                      class="ml-2"
                      :disabled="fournitures.length === 0"
                      color="primary"
                      dark
                      small
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
                <template #[`item.created_at`]="{ item }">
                  {{ $moment(item.created_at).format('ll') }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <edit-fourniture v-can="permissions.modifier" :item="item" />
                  <action-confirm
                    :item="item"
                    tip="archiver"
                    titre="Confirmer l'archivage"
                    icon="archive-plus"
                    color="error"
                    action="maintenance/fourniture/archiver"
                  >
                    Voulez vous archiver l'équipement
                    <b>{{ item.nom.toUpperCase() }}</b>
                  </action-confirm>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
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
import CreateFourniture from '~/components/maintenance/fourniture/CreateFourniture.vue'
import EditFourniture from '~/components/maintenance/fourniture/EditFourniture.vue'
export default {
  components: {
    ActionConfirm,
    SideMaintenance,
    CreateFourniture,
    EditFourniture,
  },
  data() {
    return {
      search: '',
      permissions: MaintenanceEquipement,
      headers: [
        { text: 'Nom', value: 'nom' },
        { text: 'Crée le', value: 'created_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  fetch() {
    this.getAll()
  },
  computed: {
    ...mapGetters('maintenance/fourniture', ['fournitures']),
  },
  methods: {
    ...mapActions('maintenance/fourniture', ['getAll']),
    print() {
      printjs({
        printable: this.fournitures,
        properties: [
          { field: 'code', displayName: 'Code' },
          { field: 'nom', displayName: 'Nom' },
          { field: 'description', displayName: 'Description' },
        ],
        type: 'json',
        header: `<center><h3>Liste des Equipements de chambre</h3>${this.$moment().format(
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
