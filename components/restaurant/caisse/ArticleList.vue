<template>
  <v-col cols="12">
    <div class="text-center"><h4>Liste des Articles</h4></div>
    <v-simple-table>
      <template #default>
        <thead>
          <tr>
            <th class="text-left">Réference</th>
            <th class="text-left">Description</th>
            <th class="text-left">Quantités</th>
            <th class="text-left">Prix</th>
            <th class="text-left">Total</th>
            <th class="text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(reponse, index) in reponses" :key="index" dense>
            <td>{{ reponse.code }}</td>
            <td style="width: 30%">{{ reponse.nom }}</td>
            <td>{{ reponse.valeur }}</td>
            <td>{{ reponse.prix_vente }}</td>
            <td class="text-right">
              {{
                String(Number(reponse.prix_vente) * Number(reponse.valeur)) +
                ' FCFA'
              }}
            </td>
            <td>
              <v-btn icon>
                <v-icon color="error lighten-1" @click="retirer(reponse)"
                  >mdi-trash-can-outline</v-icon
                >
              </v-btn>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" class="text-left"><b>Total</b></td>
            <td class="text-right">
              <b>{{ calculTotal }}</b>
            </td>
          </tr>
        </tfoot>
      </template>
    </v-simple-table>
  </v-col>
</template>

<script>
export default {
  props: {
    reponses: {
      type: Array,
      required: true,
    },
  },
  computed: {
    calculTotal() {
      let total = 0
      this.reponses.forEach((reponse) => {
        total += Number(reponse.valeur) * Number(reponse.prix_vente)
      })
      return total + ' FCFA'
    },
  },
  methods: {
    retirer(item) {
      this.$emit('reponse-update', item)
    },
  },
}
</script>

<style></style>
