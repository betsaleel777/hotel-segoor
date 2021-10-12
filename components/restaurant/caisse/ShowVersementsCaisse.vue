<template>
  <v-dialog v-model="dialogue" persistent max-width="800px">
    <template #activator="{ on: dialog, attrs }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn
            v-bind="attrs"
            color="pink"
            elevation="1"
            icon
            fab
            dark
            x-small
            v-on="{ ...tooltip, ...dialog }"
          >
            <v-icon small>mdi-cash-multiple</v-icon>
          </v-btn>
        </template>
        <span>Paiements</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Détails des versments</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="dialogue = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-simple-table>
          <template #default>
            <thead>
              <tr>
                <th class="text-center">Date</th>
                <th class="text-center">Paiement par</th>
                <th class="text-right">Montant perçu</th>
                <th class="text-right">Monnaie rendue</th>
                <th class="text-right">Montant encaissé</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="element in versements" :key="element.id">
                <td class="text-center">
                  {{ $moment(element.created_at).format('llll') }}
                </td>
                <td class="text-center">{{ moyenDePaiement(element) }}</td>
                <td class="text-right">{{ element.montant | formater }}</td>
                <td class="text-right">{{ element.monnaie | formater }}</td>
                <td class="text-right">
                  {{
                    (Number(element.montant) - Number(element.monnaie))
                      | formater
                  }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" class="text-right">
                  <b>Total versé</b>
                </td>
                <td class="text-right">
                  <b>{{ totalVerse | formater }}</b>
                </td>
              </tr>
            </tfoot>
          </template>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <!-- <v-spacer></v-spacer>
        <v-btn text color="primary" @click="printer"
          ><v-icon left>mdi-printer</v-icon>imprimer</v-btn
        > -->
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialogue: false,
    }
  },
  computed: {
    totalVerse() {
      let result = 0
      this.versements.forEach((versement) => {
        result += versement.montant - versement.monnaie
      })
      return result
    },
    versements() {
      const compare = (a, b) => {
        if (this.$moment(a.jour).diff(b.jour) < 0) {
          return -1
        }
        if (this.$moment(a.jour).diff(b.jour) < 0) {
          return 1
        }
        return 0
      }
      const versements = Object.assign([], this.item.versements)
      return versements.sort(compare)
    },
  },
  methods: {
    moyenDePaiement(element) {
      if (element.mobile) {
        return element.mobile.nom
      } else if (element.espece) {
        return 'espèce'
      } else {
        return 'cheque ' + element.cheque
      }
    },
  },
}
</script>
