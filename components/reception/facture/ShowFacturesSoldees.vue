<template>
  <v-dialog v-model="dialogue" max-width="800px">
    <template #activator="{ on: dialog }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            elevation="1"
            icon
            fab
            dark
            x-small
            color="pink"
            v-on="{ ...tooltip, ...dialog }"
          >
            <v-icon small> mdi-eye </v-icon>
          </v-btn>
        </template>
        <span>visualiser</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="headline grey lighten-1 primary--text">
        Factures du {{ jour }}
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="dialogue = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-data-table
          no-data-text="Aucune Facture"
          :loading="loading"
          loading-text="En chargement ..."
          :headers="headers"
          :items="factures"
          :search="search"
          :items-per-page="10"
        >
          <template #[`top`]>
            <v-toolbar flat>
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
          <template #[`item.status`]="{ item }">
            <v-chip small :color="getColor(item.status)" dark>
              {{ item.status }}
            </v-chip>
          </template>
          <template #[`item.created_at`]="{ item }">
            {{ $moment(item.created_at).format('ll') }}
          </template>
          <template #[`item.montant`]="{ item }">
            {{ item.montant }} FCFA
          </template>
          <template #[`item.actions`]="{ item }">
            <show-facture-reception :item="item" />
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions> </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ShowFactureReception from '~/components/reception/facture/ShowFactureReception.vue'
export default {
  components: {
    ShowFactureReception,
  },
  props: {
    jour: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      search: '',
      dialogue: false,
      loading: null,
      headers: [
        { text: 'Code', value: 'code', sortable: false, align: 'center' },
        { text: 'Statut', value: 'status', sortable: false, align: 'center' },
        { text: 'Chambre', value: 'chambre', sortable: false, align: 'center' },
        { text: 'Client', value: 'client', sortable: false, align: 'center' },
        { text: 'Emise le', value: 'created_at', align: 'center' },
        { text: 'Montant', value: 'montant', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  computed: {
    ...mapGetters('facture-reception', ['factures']),
  },
  mounted() {
    this.loading = true
    this.getByDate(this.jour).then(() => {
      this.loading = false
    })
  },
  methods: {
    ...mapActions('facture-reception', ['getByDate']),
    getColor(status) {
      if (status === 'soldée') {
        return 'success'
      } else {
        return 'info'
      }
    },
  },
}
</script>

<style></style>
