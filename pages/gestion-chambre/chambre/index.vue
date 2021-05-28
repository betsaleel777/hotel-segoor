<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Chambres
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-gestion-chambre />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="recherche ..."
                single-line
                hide-details
              ></v-text-field>
              <v-data-table
                no-data-text="Aucune Chambre"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="chambres"
                :search="search"
                :items-per-page="10"
              >
                <template #[`item.status`]="{ item }">
                  <v-chip outlined small :color="getColor(item.status)" dark>
                    {{ item.status }}
                  </v-chip>
                </template>
                <template #[`item.actions`]="{ item }">
                  <edit-chambre-form
                    :categories="categories"
                    :item="item"
                    @edited-chambre="chambreEdited"
                  />
                  <delete-chambre-form
                    :item="item"
                    @deleted-chambre="chambreDeleted"
                  />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <create-form-modal
            :categories="categories"
            @new-chambre="pushChambre"
          />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import SideGestionChambre from '~/components/gestion-chambre/SideGestionChambre.vue'
import CreateFormModal from '~/components/gestion-chambre/chambre/CreateChambreForm.vue'
import EditChambreForm from '~/components/gestion-chambre/chambre/EditChambreForm.vue'
import DeleteChambreForm from '~/components/gestion-chambre/chambre/DeleteChambreForm.vue'

export default {
  components: {
    SideGestionChambre,
    CreateFormModal,
    EditChambreForm,
    DeleteChambreForm,
  },
  data() {
    return {
      search: '',
      chambres: [],
      categories: [],
      headers: [
        { text: 'Code', value: 'code', sortable: false },
        { text: 'Nom', value: 'nom', sortable: false },
        { text: 'Standing', value: 'standing', sortable: false },
        { text: 'Status', value: 'status', sortable: false },
        { text: 'Montant', value: 'montant' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    let calebasse = await this.$axios.get('gestion-chambre/chambres')
    this.chambres = calebasse.data.chambres.map((chambre) => {
      // eslint-disable-next-line camelcase
      const { prix_list, categorie_linked, ...rest } = chambre
      const { id, nom, status, code } = rest
      return {
        id,
        code,
        categorie: categorie_linked.id,
        nom,
        montant: prix_list[0].montant,
        standing: categorie_linked.nom,
        status,
      }
    })
    calebasse = await this.$axios.get('gestion-chambre/categories')
    this.categories = calebasse.data.categories
  },
  methods: {
    getColor(status) {
      if (status === 'libre') {
        return 'green'
      } else if (status === 'occupée') {
        return 'red'
      } else if (status === 'reservée') {
        return 'blue'
      } else {
        return 'orange'
      }
    },
    pushChambre(chambre) {
      this.chambres.push(chambre)
    },
    chambreEdited(chambre) {
      const index = this.chambres.findIndex(
        (element) => element.id === chambre.id
      )
      this.chambres.splice(index, 1, chambre)
    },
    chambreDeleted(chambre) {
      this.chambres = this.chambres.filter(
        (element) => element.id !== chambre.id
      )
    },
  },
}
</script>

<style></style>
