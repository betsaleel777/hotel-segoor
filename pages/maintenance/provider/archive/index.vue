<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Fournisseurs
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-maintenance />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-data-table
                no-data-text="Aucun fournisseur archivé"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="artisans"
                :search="search"
                :items-per-page="10"
                ><template #[`top`]>
                  <v-toolbar flat>
                    <v-btn
                      class="ml-2"
                      color="primary"
                      dark
                      :to="`/maintenance/provider/`"
                    >
                      <v-icon left>mdi-arrow-left-thick</v-icon>
                      retour
                    </v-btn>
                    <v-btn
                      class="ml-2"
                      :disabled="artisans.length === 0"
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
                    action="maintenance/provider/restorer"
                  >
                    Voulez restaurer du fournisseur
                    <b>{{ item.nom.toUpperCase() }}</b>
                  </action-confirm>
                  <action-confirm
                    v-can="permissions.supprimer"
                    :item="item"
                    tip="supprimer"
                    color="error"
                    titre="Confirmer la suppression"
                    icon="delete"
                    action="maintenance/provider/supprimer"
                  >
                    Voulez vous réelement supprimer du fournisseur
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
import { MaintenanceArtisan } from '~/helper/permissions'
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
      permissions: MaintenanceArtisan,
      headers: [
        { text: 'Nom et prénom', value: 'fullname' },
        { text: 'Spécialité', value: 'categorie.nom', sortable: false },
        { text: 'Téléphone', value: 'telephone', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  fetch() {
    this.getTrashed()
  },
  computed: {
    ...mapGetters({ artisans: 'maintenance/provider/providers' }),
  },
  methods: {
    ...mapActions({ getTrashed: 'maintenance/provider/getTrashed' }),
    print() {
      printjs({
        printable: this.artisans,
        properties: [
          { field: 'fullname', displayName: 'Nom et Prénom' },
          { field: 'categorie.nom', displayName: 'Spécialité' },
          { field: 'telephone', displayName: 'Téléphone' },
          { field: 'adresse', displayName: 'Adresse' },
          { field: 'email', displayName: 'Email' },
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
