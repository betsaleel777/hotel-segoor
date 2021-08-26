<template>
  <v-row>
    <v-col cols="12">
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
              '(' + Number(ligne.quantite) + ' tournée)'
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
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    item: {
      type: Number,
      required: true,
    },
  },
  data: () => {
    return {
      show: false,
      liste: [],
    }
  },
  computed: {
    ...mapGetters('cocktail', ['editListes']),
  },
  mounted() {
    const listeApresFiltre = this.editListes.filter(
      (element) => element.id === this.item
    )
    this.liste = listeApresFiltre[0].content
  },
  methods: {
    ...mapActions('cocktail', ['removeEditContent']),
    retirer(content) {
      this.removeEditContent({ id: this.item, content })
    },
  },
}
</script>

<style></style>
