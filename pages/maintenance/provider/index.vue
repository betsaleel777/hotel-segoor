<template>
  <v-card elevation="2" shaped tile>
    <v-card-title class="headline grey lighten-1 primary--text">
      Fournisseurs
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="2">
          <side-maintenance />
        </v-col>
        <v-col cols="12" sm="6" md="10">
          <v-data-table
            no-data-text="Aucun Fournisseur"
            :loading="$fetchState.pending"
            loading-text="En chargement ..."
            :headers="headers"
            :items="artisans"
            :search="search"
            :items-per-page="10"
          >
            <template #[`top`]>
              <v-toolbar flat>
                <create-provider
                  v-can="permissions.creation"
                  :categories="categories"
                />
                <v-btn
                  class="ml-2"
                  color="primary"
                  dark
                  :to="`/maintenance/provider/archive/`"
                  small
                >
                  <v-icon left>mdi-archive</v-icon>
                  archives
                </v-btn>
                <v-btn
                  class="ml-2"
                  :disabled="artisans.length === 0"
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
              <show-provider :id="item.id" />
              <edit-provider
                v-can="permissions.modifier"
                :item="item"
                :categories="categories"
              />
              <action-confirm
                :item="item"
                tip="archiver"
                titre="Confirmer l'archivage"
                icon="archive-plus"
                color="error"
                action="maintenance/provider/archiver"
              >
                Voulez vous archiver le fournisseur
                <b>{{ item.nom.toUpperCase() }}</b>
              </action-confirm>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions></v-card-actions>
  </v-card>
</template>

<script>
import printjs from 'print-js'
import { mapGetters, mapActions } from 'vuex'
import { MaintenanceArtisan } from '~/helper/permissions'
import ActionConfirm from '~/components/ActionConfirm.vue'
import SideMaintenance from '~/components/maintenance/SideMaintenance.vue'
import EditProvider from '~/components/maintenance/provider/EditProvider.vue'
import CreateProvider from '~/components/maintenance/provider/CreateProvider.vue'
import ShowProvider from '~/components/maintenance/provider/ShowProvider.vue'
export default {
  components: {
    ActionConfirm,
    SideMaintenance,
    EditProvider,
    CreateProvider,
    ShowProvider,
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
  async fetch() {
    await this.getArtisans()
    await this.getCategories()
  },
  computed: {
    ...mapGetters({
      artisans: 'maintenance/provider/providers',
      categories: 'parametre/categorie-reparation/categories',
    }),
  },
  methods: {
    ...mapActions({
      getArtisans: 'maintenance/provider/getAll',
      getCategories: 'parametre/categorie-reparation/getAll',
    }),
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
        header: `<center><h3>Liste des artisans</h3>${this.$moment().format(
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
