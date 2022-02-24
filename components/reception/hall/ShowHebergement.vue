<template>
  <v-dialog v-model="dialogue" persistent max-width="600px">
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
      <v-card-title>
        <span class="headline primary--text">Détail hébergement </span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Nom</v-list-item-title>
                  <v-list-item-subtitle>{{
                    item.client_linked.nom | upper
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Prénom</v-list-item-title>
                  <v-list-item-subtitle>{{
                    item.client_linked.prenom | upper
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Chambre</v-list-item-title>
                  <v-list-item-subtitle>{{
                    item.chambre_linked.nom
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Délais du sejour</v-list-item-title>
                  <v-list-item-subtitle
                    >du {{ $moment(item.entree).format('ll') }} au
                    {{
                      $moment(item.sortie).format('ll')
                    }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="6">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Montant du sejour</v-list-item-title>
                  <v-list-item-subtitle>{{
                    item.montant | formater
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Extra</v-list-item-title>
                  <v-list-item-subtitle>{{
                    item.consommation | formater
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Versement</v-list-item-title>
                  <v-list-item-subtitle>{{
                    item.verse | formater
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="dialogue = false"> Fermer </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  filters: {
    upper(value) {
      if (!value) return ''
      return value.toUpperCase()
    },
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
  data: () => {
    return {
      dialogue: false,
    }
  },
}
</script>

<style></style>
