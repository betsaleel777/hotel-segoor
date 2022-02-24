<template>
  <div class="mt-4">
    <v-data-table
      v-if="!archiveMode"
      no-data-text="Aucun élément"
      :loading="loading"
      loading-text="En chargement ..."
      :headers="headers"
      :items="moyens"
      :search="search"
      :items-per-page="10"
    >
      <template #[`top`]>
        <v-toolbar flat>
          <create-paiement
            v-can="permissions.creation"
            :restaurant="restaurant"
          />
          <v-btn class="ml-2" color="primary" dark @click="switchArchive">
            <v-icon left>mdi-archive</v-icon>
            archives
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
        <edit-paiement
          v-can="permissions.modifier"
          :item="item"
          :restaurant="restaurant"
        />
        <action-confirm
          :restaurant="restaurant"
          :item="item"
          tip="archiver"
          titre="Confirmer l'archivage"
          icon="archive-plus"
          color="error"
          :action="`externe/parametre/moyen/archiver`"
        >
          Voulez vous archiver le paiement mobile
          <b>{{ item.nom.toUpperCase() }}</b>
        </action-confirm>
      </template>
    </v-data-table>
    <v-data-table
      v-if="archiveMode"
      no-data-text="éléments archivées"
      :loading="loading1"
      loading-text="En chargement ..."
      :headers="headers"
      :items="archives"
      :search="search"
      :items-per-page="10"
    >
      <template #[`top`]>
        <v-toolbar flat>
          <v-btn color="primary" dark @click="initial">
            <v-icon left>mdi-arrow-left-thick</v-icon>
            retour
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
        <action-confirm
          v-can="permissions.restorer"
          :restaurant="restaurant"
          :item="item"
          tip="restorer"
          titre="Confirmer la restauration"
          icon="restore"
          color="primary"
          :action="`externe/parametre/moyen/restorer`"
        >
          Voulez vous archiver du paiement mobile
          <b>{{ item.nom.toUpperCase() }}</b>
        </action-confirm>
        <action-confirm
          v-can="permissions.supprimer"
          :restaurant="restaurant"
          :item="item"
          tip="supprimer"
          titre="Confirmer la suppression"
          icon="delete"
          color="error"
          :action="`externe/parametre/moyen/supprimer`"
        >
          Voulez vous archiver paiement mobile
          <b>{{ item.nom.toUpperCase() }}</b>
        </action-confirm>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CreatePaiement from './CreatePaiementWayExterne.vue'
import EditPaiement from './EditPaiementWayExterne.vue'
import { ParametreMobileExterne } from '~/helper/permissions'
import ActionConfirm from '~/components/externe/ActionConfirmExterne.vue'
export default {
  components: {
    CreatePaiement,
    EditPaiement,
    ActionConfirm,
  },
  props: {
    restaurant: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      search: '',
      loading: false,
      loading1: false,
      archiveMode: false,
      dialog: false,
      permissions: ParametreMobileExterne,
      headers: [
        { text: 'Nom', value: 'nom' },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          width: '30%',
          align: 'center',
        },
      ],
    }
  },
  computed: {
    ...mapGetters('externe/parametre/moyen', ['archives', 'moyens']),
  },
  mounted() {
    this.initial()
  },
  methods: {
    ...mapActions('externe/parametre/moyen', ['getTrashed', 'getAll']),
    async switchArchive() {
      this.archiveMode = true
      this.loading1 = true
      await this.getTrashed({ restaurant_id: this.restaurant })
      this.loading1 = false
    },
    async initial() {
      this.archiveMode = false
      this.loading = true
      await this.getAll({ restaurant_id: this.restaurant })
      this.loading = false
    },
  },
}
</script>

<style></style>
