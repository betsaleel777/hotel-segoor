<template>
  <v-row>
    <v-col cols="7">
      <v-autocomplete
        v-model="tournee"
        :items="tournees"
        item-value="id"
        item-text="titre"
        return-object
        dense
        outlined
        label="Articles"
        required
      >
        <template #label>
          Articles<span class="red--text"><strong> *</strong></span>
        </template>
      </v-autocomplete>
    </v-col>
    <v-col cols="4">
      <v-text-field
        v-model="quantite"
        dense
        outlined
        label="Nombre de tournée"
        type="number"
        min="0"
        required
      >
        <template #label>
          Nombre de tournée<span class="red--text"><strong> *</strong></span>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="1">
      <v-btn dark color="primary" elevation="4" fab small @click="addTournee"
        ><v-icon dark>mdi-plus</v-icon></v-btn
      >
    </v-col>
    <v-row>
      <v-col v-if="liste.length > 0" cols="12">
        <v-list-item v-for="(ligne, index) in liste" :key="index" dense>
          <!-- <v-list-item-avatar>
          <v-btn icon>
            <v-icon color="primary lighten-1" @click="show = true"
              >mdi-information</v-icon
            >
          </v-btn>
        </v-list-item-avatar> -->
          <v-list-item-content>
            <v-list-item-title
              >{{ ligne.titre + ' '
              }}{{
                '(' + Number(ligne.quantite) + ' tournées)'
              }}</v-list-item-title
            >
            <v-divider></v-divider>
          </v-list-item-content>
          <!-- <v-tooltip v-model="show" top>
          <span>{{ liste.description }}</span>
        </v-tooltip> -->
          <v-list-item-action>
            <v-btn icon>
              <v-icon color="error lighten-1" @click="retirer(ligne)"
                >mdi-trash-can-outline</v-icon
              >
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-col>
    </v-row>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data: () => ({
    tournee: {},
    quantite: 0,
    liste: [],
  }),
  computed: {
    ...mapGetters('stock/tournee', ['tournees']),
  },
  mounted() {
    this.getAll()
  },
  methods: {
    ...mapActions('stock/tournee', ['getAll']),
    addTournee() {
      if (this.tournee && this.quantite !== 0) {
        const index = this.liste.findIndex(
          (element) => element.id === this.tournee.id
        )
        if (index === -1) {
          this.liste.push({
            titre: this.tournee.titre,
            id: this.tournee.id,
            quantite: this.quantite,
          })
        } else {
          this.liste.splice(index, 1, {
            titre: this.tournee.titre,
            id: this.tournee.id,
            quantite: this.quantite,
          })
        }
        this.tournee = {}
        this.quantite = 0
        this.$emit('update-list', this.liste)
      } else {
        const message = 'veuillez remplir correctement les champs'
        this.$notifier.show({ text: message, variant: 'error' })
      }
    },
    retirer(item) {
      const index = this.liste.findIndex((element) => element.id === item.id)
      if (index !== -1) this.liste.splice(index, 1)
    },
  },
}
</script>

<style></style>
