<template>
  <div class="mt-3">
    <v-data-table
      v-if="!archiveMode"
      no-data-text="Aucune Categories"
      :loading="loading"
      loading-text="En chargement ..."
      :headers="headers"
      :items="categories"
      :search="search"
      :items-per-page="10"
    >
      <template #[`top`]>
        <v-toolbar flat>
          <v-btn dark color="primary" @click="dialog = true">
            <v-icon left>mdi-plus-thick</v-icon>
            AJOUTER
          </v-btn>
          <create-categorie
            v-model="dialog"
            :element="element"
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
        <edit-categorie
          v-can="permissions.modifier"
          :item="item"
          :element="element"
          :restaurant="restaurant"
        />
        <action-confirm
          :restaurant="restaurant"
          :item="item"
          tip="archiver"
          titre="Confirmer l'archivage"
          icon="archive-plus"
          color="error"
          :action="`externe/parametre/categorie-${element}/archiver`"
        >
          Voulez vous archiver l'élément
          <b>{{ item.nom.toUpperCase() }}</b>
        </action-confirm>
      </template>
    </v-data-table>
    <v-data-table
      v-if="archiveMode"
      no-data-text="Categorie archivées"
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
          :restaurant="restaurant"
          :item="item"
          tip="restorer"
          titre="Confirmer la restauration"
          icon="restore"
          color="primary"
          :action="`externe/parametre/categorie-${element}/restorer`"
        >
          Voulez vous archiver l'élément
          <b>{{ item.nom.toUpperCase() }}</b>
        </action-confirm>
        <action-confirm
          :restaurant="restaurant"
          :item="item"
          tip="supprimer"
          titre="Confirmer la suppression"
          icon="delete"
          color="error"
          :action="`externe/parametre/categorie-${element}/supprimer`"
        >
          Voulez vous archiver l'élément
          <b>{{ item.nom.toUpperCase() }}</b>
        </action-confirm>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import CreateCategorie from '~/components/externe/CreateCategorieExterne.vue'
import EditCategorie from '~/components/externe/parametre/categorie/EditCategorieExterne.vue'
import { parameterSet } from '~/helper/permissions'
import ActionConfirm from '~/components/externe/ActionConfirmExterne.vue'
export default {
  components: { CreateCategorie, EditCategorie, ActionConfirm },
  props: {
    restaurant: {
      type: Number,
      required: true,
    },
    element: {
      type: String,
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
      permissions: parameterSet(this.element),
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
    categories() {
      return this.$store.getters[
        `externe/parametre/categorie-${this.element}/categories`
      ]
    },
    archives() {
      return this.$store.getters[
        `externe/parametre/categorie-${this.element}/archives`
      ]
    },
  },
  mounted() {
    this.initial()
  },
  methods: {
    async switchArchive() {
      this.archiveMode = true
      this.loading1 = true
      await this.$store.dispatch(
        `externe/parametre/categorie-${this.element}/getTrashed`,
        {
          restaurant_id: this.restaurant,
        }
      )
      this.loading1 = false
    },
    async initial() {
      this.archiveMode = false
      this.loading = true
      await this.$store.dispatch(
        `externe/parametre/categorie-${this.element}/getAll`,
        {
          restaurant_id: this.restaurant,
        }
      )
      this.loading = false
    },
  },
}
</script>

<style></style>
