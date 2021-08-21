<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Point financier du restaurant
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-gestion-bar />
            </v-col>
            <v-col cols="9">
              <v-data-table
                dense
                no-data-text="Liste vide"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="lignes"
                :search="search"
                :items-per-page="15"
                locale="fr"
              >
                <template #[`top`]>
                  <v-toolbar flat>
                    <date-choice-finance @reglage-finished="getProducts" />
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
                <template #[`item.type`]="{ item }">
                  <v-chip
                    label
                    outlined
                    small
                    :color="getColor(item.type)"
                    dark
                  >
                    {{ item.type }}
                  </v-chip>
                </template>
                <template #[`item.prix`]="{ item }">
                  {{ item.prix }} FCFA
                </template>
                <template #[`item.montant`]="{ item }">
                  {{ item.vendues * item.prix }} FCFA
                </template>
                <template #[`body.append`]>
                  <tr>
                    <td colspan="4"><b>Montant total vendu</b></td>
                    <td class="text-right">
                      <b>{{ total }} FCFA</b>
                    </td>
                  </tr>
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
import DateChoiceFinance from '~/components/ReglageChoiceFinance.vue'
import SideGestionBar from '~/components/bar/SideGestionBar.vue'
let departement = 0
export default {
  components: {
    DateChoiceFinance,
    SideGestionBar,
  },
  data() {
    return {
      search: '',
      lignes: [],
      total: 0,
      headers: [
        { text: 'Description', value: 'nom', align: 'left' },
        { text: 'Type Article', value: 'type', align: 'center' },
        { text: 'Quantités', value: 'vendues', align: 'center' },
        { text: 'Prix de vente', value: 'prix', align: 'right' },
        { text: 'Montant', value: 'montant', align: 'right' },
      ],
    }
  },
  async fetch() {
    // doit recuperer le departement de l'utilisateur
    let requete = await this.$axios.get(
      'parametre/departements/' + 'restaurant'
    )
    departement = requete.data.departement
    requete = await this.$axios.get(
      'caisses/encaissements/finance/' + departement.id
    )
    let total = 0
    const lignes = requete.data.point.map((ligne) => {
      total += ligne.quantite * ligne.prix
      return {
        id: ligne.id,
        nom: ligne.nom,
        code: ligne.code,
        vendues: ligne.quantite,
        type: ligne.type,
        prix: ligne.prix,
      }
    })
    this.lignes = lignes
    this.total = total
  },
  methods: {
    getColor(status) {
      if (status === 'plat') {
        return 'grey'
      } else if (status === 'tournee') {
        return 'red'
      } else if (status === 'cocktail') {
        return 'blue'
      } else {
        return 'pink'
      }
    },
    calculTotal() {
      let total = 0
      this.lignes.forEach((ligne) => {
        total += ligne.prix * ligne.vendues
      })
      this.total = total
    },
    getProducts(laDate, lesDates) {
      if (laDate.length > 0) {
        this.$axios
          .get(`caisses/encaissements/finance/${departement.id}/${laDate}`)
          .then((result) => {
            this.lignes = result.data.point
            this.calculTotal()
          })
      } else if (lesDates.length > 0) {
        this.$axios
          .get(
            `caisses/encaissements/finance/${departement.id}/${lesDates[0]}/${lesDates[1]}`
          )
          .then((result) => {
            this.lignes = result.data.point
            this.calculTotal()
          })
      } else {
        this.$notifier.show({
          text: 'Aucun réglage sélectioné',
          variant: 'info',
        })
      }
    },
  },
}
</script>

<style></style>
