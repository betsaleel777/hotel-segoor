<template>
  <v-dialog v-model="dialogue" max-width="500px">
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
      <v-card-title
        class="justify-center primary--text subtitle-1 grey lighten-2"
        >{{ item.titre.toUpperCase() }}, {{ item.created_at }}
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="closeShow">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text justify="center" align="center">
        <v-simple-table>
          <template v-if="item.status === 'livrée'" #default>
            <thead>
              <tr>
                <th class="text-left">Description</th>
                <th class="text-left">Quantités demandées</th>
                <th class="text-left">Quantités livrées</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(article, index) in articles" :key="index" dense>
                <td style="width: 30%">
                  {{
                    article.nom.charAt(0).toUpperCase() + article.nom.slice(1)
                  }}
                </td>
                <td>{{ article.pivot.demandees + article.mesure }}</td>
                <td>{{ article.pivot.quantite + article.mesure }}</td>
              </tr>
            </tbody>
          </template>
          <template v-else-if="item.status === 'confirmée'" #default>
            <thead>
              <tr>
                <th class="text-left">Description</th>
                <th class="text-left">Quantités demandées</th>
                <th class="text-left">Quantités livrées</th>
                <th class="text-left">Quantités reçues</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(article, index) in articles" :key="index" dense>
                <td style="width: 30%">
                  {{ article.nom.toUpperCase() }}
                </td>
                <td>{{ article.pivot.demandees + article.mesure }}</td>
                <td>{{ article.pivot.quantite + article.mesure }}</td>
                <td>{{ article.pivot.recues + article.mesure }}</td>
              </tr>
            </tbody>
          </template>
          <template v-else #default>
            <thead>
              <tr>
                <th class="text-left">Description</th>
                <th class="text-left">Quantités demandées</th>
                <th class="text-left">Quantités livrées</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(article, index) in articles" :key="index" dense>
                <td style="width: 30%">
                  {{
                    article.nom.charAt(0).toUpperCase() + article.nom.slice(1)
                  }}
                </td>
                <td>{{ article.pivot.demandees + article.mesure }}</td>
                <td>{{ '0' + article.mesure }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="closeShow">Fermer</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
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
  data: () => ({
    dialogue: false,
    articles: [],
  }),
  mounted() {
    this.articles = this.item.produits
    if (this.item.status !== 'en cours')
      this.articles = this.item.sortie.produits
  },
  methods: {
    closeShow() {
      this.dialogue = false
    },
  },
}
</script>

<style></style>
