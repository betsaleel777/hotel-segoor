<template>
  <v-dialog v-model="dialog" persistent max-width="850px">
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="headline primary--text">Ordre de Réparation</span>
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-list>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Nom: </b
                    >{{ item.name }}</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Catégorie: </b
                    >{{ item.nomCategorie }}</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Chambre: </b
                    >{{ item.nomChambre }}</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Coût: </b
                    >{{ item.montant | formater }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="6">
              <v-list>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Fournisseur: </b
                    >{{ item.fullnameProvider }}</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Date: </b
                    >{{
                      $moment(item.start).format('DD-MM-YYYY')
                    }}</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4"
                      >Heures de travail: </b
                    >de {{ $moment(item.start).format('HH:mm') }} à
                    {{ $moment(item.end).format('HH:mm') }}</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title
                    ><b class="primary--text text--darken-4">Coût total: </b
                    >{{ item.montant | formater }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
          <v-alert
            class="my-3"
            text
            outlined
            color="info"
            icon="mdi-checkbox-marked-outline"
          >
            <h4>Tâches exécutées pour la réparation</h4>
            <v-divider class="my-1 info" style="opacity: 0.22"></v-divider>
            <div v-html="item.description"></div>
          </v-alert>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="dialog = false"> Fermer </v-btn>
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
    value: Boolean,
  },
  computed: {
    dialog: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
}
</script>

<style></style>
