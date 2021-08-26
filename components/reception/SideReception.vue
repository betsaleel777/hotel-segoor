<template>
  <v-navigation-drawer class="d-print-none" permanent>
    <v-list nav dense>
      <v-list-item-group color="blue darken-4">
        <v-list-item
          v-for="(module, i) in modules"
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
export default {
  data: () => ({
    modules: [
      {
        icon: 'mdi-home-circle',
        text: 'Hébergements',
        to: '/reception/hall',
        permission: 'acces hébergement',
      },
      {
        icon: 'mdi-shield-home',
        text: 'Réservation',
        to: '/reception/reservation',
        permission: 'accès réservation',
      },
      {
        icon: 'mdi-account-group',
        text: 'Gestion de la Clientelle',
        to: '/reception/clientelle',
        permission: 'acces clientelle',
      },
    ],
  }),
}
</script>

<style></style>
