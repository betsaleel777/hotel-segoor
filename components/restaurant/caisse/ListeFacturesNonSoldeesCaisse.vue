<template>
  <v-data-table
    no-data-text="Aucune Donnée"
    :loading="loading"
    loading-text="En chargement ..."
    :headers="headers"
    :items="encaissements"
    :search="search"
    :items-per-page="10"
  >
    <template #[`top`]>
      <v-toolbar flat>
        <create-encaissement
          v-can="'creation facture restau'"
          :produits="allProducts"
          :attributions="attributionsSansFactures"
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
    <template #[`item.client`]="{ item }">
      {{ item.client.toUpperCase() }}
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
    <template #[`item.zone`]="{ item }">
      <v-chip v-if="item.zone" small label color="secondary" dark>{{
        item.zone
      }}</v-chip>
      <v-chip v-else small label color="error" dark> vide </v-chip>
    </template>
    <template #[`item.actions`]="{ item }">
      <paiement-facture-caisse
        v-if="item.client === 'Anonyme'"
        :moyens="moyensDepaiement"
        :item="item"
      />
      <show-encaissement :item="item" />
      <completer-encaissement
        v-if="item.status === 'impayé'"
        v-can="'modification facture restau'"
        :item="item"
        :produits="allProducts"
      />
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PaiementFactureCaisse from './PaiementFactureCaisse'
import CreateEncaissement from '~/components/restaurant/caisse/CreateEncaissement'
import ShowEncaissement from '~/components/restaurant/caisse/ShowEncaissement'
import CompleterEncaissement from '~/components/restaurant/caisse/CompleterEncaissement'

export default {
  components: {
    CreateEncaissement,
    ShowEncaissement,
    CompleterEncaissement,
    PaiementFactureCaisse,
  },
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  data() {
    return {
      search: '',
      loading: false,
      dialog1: false,
      allProducts: [],
      attributionsSansFactures: [],
      headers: [
        { text: 'Client', value: 'client', align: 'left', sortable: false },
        { text: 'Statut', value: 'status', align: 'center', sortable: false },
        { text: 'Date', value: 'created_at', align: 'center' },
        { text: 'Table', value: 'zone', align: 'center', sortable: false },
        { text: 'Montant', value: 'montant', align: 'center' },
        { text: 'Versé', value: 'verse', align: 'center' },
        { text: 'Actions', value: 'actions', align: 'right', sortable: false },
      ],
    }
  },
  computed: {
    ...mapGetters({
      produits: 'stock/article/articles',
      encaissements: 'caisse/encaissement/encaissements',
      attributions: 'reception/attribution/attributionsEnCours',
      plats: 'stock/plat/plats',
      tournees: 'stock/tournee/tournees',
      cocktails: 'stock/cocktail/cocktails',
      moyensDepaiement: 'moyen/moyens',
    }),
  },
  async mounted() {
    this.loading = true
    await this.getProduits(1)
    await this.getPlats()
    await this.getTournees()
    await this.getCocktails()
    await this.getMoyens()
    this.allProducts.push(...this.produits)
    this.allProducts.push(...this.plats)
    this.allProducts.push(...this.tournees)
    this.allProducts.push(...this.cocktails)
    await this.getAttributions()
    await this.getEncaissements().then(() => {
      const dejaSurListe = (attribution) => {
        return this.encaissements.every(
          (encaissement) =>
            attribution.id !== encaissement.attribution_linked?.id
        )
      }
      this.attributionsSansFactures = this.attributions.filter(dejaSurListe)
      this.loading = false
    })
  },
  methods: {
    ...mapActions({
      getProduits: 'stock/article/getArticlesDepartement',
      getEncaissements: 'caisse/encaissement/getEncaissementsRestau',
      getAttributions: 'reception/attribution/getEnCours',
      getPlats: 'stock/plat/getPlats',
      getTournees: 'stock/tournee/getTourneesCaisse',
      getCocktails: 'stock/cocktail/getCocktails',
      getMoyens: 'moyen/getAll',
    }),
    getColor(status) {
      if (status === 'soldée') {
        return 'green'
      } else {
        return 'red'
      }
    },
  },
}
</script>

<style></style>
