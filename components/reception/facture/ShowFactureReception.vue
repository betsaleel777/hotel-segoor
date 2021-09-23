<template>
  <v-dialog v-model="dialogue" persistent max-width="700px">
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
            <v-icon small>mdi-eye</v-icon>
          </v-btn>
        </template>
        <span>visualiser</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Paiements</span>
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
                <th class="text-center">Moyen</th>
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
                <td class="text-right">{{ element.montant }} FCFA</td>
                <td class="text-right">{{ element.monnaie }} FCFA</td>
                <td class="text-right">
                  {{ Number(element.montant) - Number(element.monnaie) }}
                  FCFA
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" class="text-right">
                  <b>Total versé</b>
                </td>
                <td class="text-right">
                  <b>{{ totalVerse }} FCFA</b>
                </td>
              </tr>
            </tfoot>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
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
    versements() {
      return this.item.versements
    },
    totalVerse() {
      let total = 0
      this.versements.forEach((element) => {
        total += element.montant - element.monnaie
      })
      return total
    },
  },
  methods: {
    moyenDePaiement(element) {
      if (element.mobile) {
        return element.mobile.nom
      } else if (element.espece) {
        return 'espèce'
      } else {
        return element.cheque
      }
    },
  },
}
</script>
<style lang=""></style>
