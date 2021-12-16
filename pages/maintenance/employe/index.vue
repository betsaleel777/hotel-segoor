<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Employes
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="2">
              <side-maintenance />
            </v-col>
            <v-col cols="12" sm="6" md="10">
              <v-data-table
                no-data-text="Aucun employé"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="employes"
                :search="search"
                :items-per-page="10"
                ><template #[`top`]>
                  <v-toolbar flat>
                    <create-employe v-can="permissions.creation" />
                    <v-btn
                      class="ml-2"
                      color="primary"
                      dark
                      :to="`/maintenance/employe/archive/`"
                      small
                    >
                      <v-icon left>mdi-archive</v-icon>
                      archives
                    </v-btn>
                    <v-btn
                      class="ml-2"
                      :disabled="employes.length === 0"
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
                <template #[`item.actions`]="{ item }">
                  <edit-employe v-can="permissions.modifier" :item="item" />
                  <action-confirm
                    :item="item"
                    tip="archiver"
                    titre="Confirmer l'archivage"
                    icon="archive-plus"
                    color="error"
                    action="maintenance/employe/archiver"
                  >
                    Voulez vous archiver l'employé
                    <b>{{ item.nom.toUpperCase() }}</b>
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
import { MaintenanceEmploye } from '~/helper/permissions'
import ActionConfirm from '~/components/ActionConfirm.vue'
import SideMaintenance from '~/components/maintenance/SideMaintenance.vue'
import CreateEmploye from '~/components/maintenance/employe/CreateEmploye.vue'
import EditEmploye from '~/components/maintenance/employe/EditEmploye.vue'
export default {
  components: {
    ActionConfirm,
    SideMaintenance,
    CreateEmploye,
    EditEmploye,
  },
  data() {
    return {
      search: '',
      permissions: MaintenanceEmploye,
      headers: [
        { text: 'Nom et prénom', value: 'fullname' },
        { text: 'Poste', value: 'poste', sortable: false },
        { text: 'Téléphone', value: 'telephone', sortable: false },
        { text: 'Adresse', value: 'adresse', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  fetch() {
    this.getAll()
  },
  computed: {
    ...mapGetters('maintenance/employe', ['employes']),
  },
  methods: {
    ...mapActions('maintenance/employe', ['getAll']),
    print() {
      printjs({
        printable: this.employes,
        properties: [
          { field: 'fullname', displayName: 'Nom et Prénom' },
          { field: 'poste', displayName: 'Poste' },
          { field: 'telephone', displayName: 'Téléphone' },
          { field: 'adresse', displayName: 'Adresse' },
          { field: 'email', displayName: 'Email' },
        ],
        type: 'json',
        header: `<center><h3>Liste des employes</h3>${this.$moment().format(
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
