<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          {{ restaurant.nom }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-externe :restaurant="Number($route.params.restaurant)" />
            </v-col>
            <v-col justify="center" align="center" cols="12" sm="6" md="9">
              Dashboard du restaurant {{ restaurant.nom }}
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions> </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SideExterne from '~/components/externe/SideExterne.vue'

export default {
  components: { SideExterne },
  computed: {
    ...mapGetters('externe/restaurant', ['restaurant']),
  },
  mounted() {
    this.getOne(this.$route.params.restaurant)
  },
  methods: {
    ...mapActions('externe/restaurant', ['getOne']),
  },
}
</script>

<style></style>
