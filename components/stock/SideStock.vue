<template>
  <v-navigation-drawer permanent>
    <v-list nav dense>
      <v-list-item-group color="blue darken-4">
        <v-list-item
          v-for="(module, i) in sousModulesStock"
          :key="i"
          v-can="module.permission"
          nuxt
          :to="module.to"
        >
          <v-list-item-icon>
            <v-icon color="orange darken-2" v-text="module.icon"></v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-text="module.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['sousModulesStock']),
  },
}
</script>

<style></style>
