<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Moyens de paiement mobile
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-parametre />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-data-table
                no-data-text="Aucun moyen de paiement"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="moyens"
                :search="search"
                :items-per-page="10"
              >
                <template #[`top`]>
                  <v-toolbar flat>
                    <create-mobile-way />
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
                  <edit-mobile-way :item="item" />
                  <delete-mobile-way :item="item" />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions> </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SideParametre from '~/components/parametre/SideParametre.vue'
import CreateMobileWay from '~/components/parametre/paiement-mobile/CreateMobileWay.vue'
import EditMobileWay from '~/components/parametre/paiement-mobile/EditMobileWay.vue'
import DeleteMobileWay from '~/components/parametre/paiement-mobile/DeleteMobileWay.vue'

export default {
  components: {
    SideParametre,
    CreateMobileWay,
    EditMobileWay,
    DeleteMobileWay,
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Nom', value: 'nom', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  fetch() {
    this.getAll()
  },
  computed: {
    ...mapGetters('moyen', ['moyens']),
  },
  methods: {
    ...mapActions('moyen', ['getAll']),
  },
}
</script>

<style></style>
