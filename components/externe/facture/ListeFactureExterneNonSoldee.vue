<template>
  <v-data-table
    no-data-text="Aucune facture"
    :loading="loading"
    loading-text="En chargement ..."
    :headers="headers"
    :items="factures"
    :search="search"
    :items-per-page="10"
  >
    <template #[`top`]>
      <v-toolbar flat>
        <create-facture
          v-can="permissions.create"
          :restaurant="restaurant"
          :articles="produits"
          :tables="freeTables"
        />
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
    <template #[`item.status`]="{ item }">
      <v-chip outlined small :color="getColor(item.status)" dark>
        {{ item.status }}
      </v-chip>
    </template>
    <template #[`item.montant`]="{ item }">
      {{ item.montant | formater }}
    </template>
    <template #[`item.verse`]="{ item }">
      {{ item.verse | formater }}
    </template>
    <template #[`item.table`]="{ item }">
      <v-chip v-if="item.table" small label color="secondary" dark>{{
        item.table.nom
      }}</v-chip>
      <v-chip v-else small label color="primary" dark>emporté</v-chip>
    </template>
    <template #[`item.actions`]="{ item }">
      <show-facture :id="item.id" />
      <edit-facture
        v-can="'modification externe factures'"
        :articles="produits"
        :restaurant="restaurant"
        :tables="freeTables"
        :item="item"
      />
      <paiement-facture
        :moyens="moyens"
        :item="item"
        :restaurant="restaurant"
      />
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CreateFacture from './CreateFactureExterne.vue'
import PaiementFacture from './PaiementFactureExterne.vue'
import EditFacture from '~/components/externe/facture/EditFactureExterne.vue'
import ShowFacture from '~/components/externe/facture/ShowFactureExterne.vue'
import { FactureExterne } from '~/helper/permissions'
export default {
  components: {
    CreateFacture,
    ShowFacture,
    EditFacture,
    PaiementFacture,
  },
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  props: {
    factures: {
      type: Array,
      required: true,
    },
    restaurant: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      search: '',
      loading: false,
      permissions: { create: FactureExterne.creation },
      produits: [],
      freeTables: [],
      headers: [
        { text: 'Date', value: 'created_at', align: 'center' },
        { text: 'Table', value: 'table', align: 'center', sortable: false },
        { text: 'Montant', value: 'montant', align: 'center' },
        { text: 'Versé', value: 'verse', align: 'center' },
        { text: 'Actions', value: 'actions', align: 'right', sortable: false },
      ],
    }
  },
  computed: {
    ...mapGetters({
      articles: 'externe/article/articles',
      plats: 'externe/plat/plats',
      tournees: 'externe/tournee/tournees',
      cocktails: 'externe/cocktail/cocktails',
      tables: 'externe/parametre/table/tables',
      moyens: 'externe/parametre/moyen/moyens',
    }),
  },
  async mounted() {
    this.loading = true
    await this.getArticles(this.restaurant)
    await this.getPlats(this.restaurant)
    await this.getTournees(this.restaurant)
    await this.getCocktails(this.restaurant)
    this.produits = [
      ...this.articles,
      ...this.plats,
      ...this.cocktails,
      ...this.tournees,
    ]
    await this.getTables({ restaurant_id: this.restaurant }).then(() => {
      const ids = []
      this.factures.forEach(({ table_id: id }) => {
        ids.push(id)
      })
      this.tables.forEach((table) => {
        if (ids.includes(table.id)) {
          this.freeTables.push({ ...table, disabled: true })
        } else {
          this.freeTables.push(table)
        }
      })
    })
    this.getMobiles({ restaurant_id: this.restaurant })
    this.loading = false
  },
  methods: {
    ...mapActions({
      getTables: 'externe/parametre/table/getAll',
      getArticles: 'externe/article/getArticles',
      getPlats: 'externe/plat/getPlats',
      getTournees: 'externe/tournee/getTournees',
      getCocktails: 'externe/cocktail/getCocktails',
      getMobiles: 'externe/parametre/moyen/getAll',
    }),
  },
}
</script>

<style></style>
