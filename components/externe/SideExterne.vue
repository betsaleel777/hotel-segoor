<template>
  <v-navigation-drawer permanent>
    <v-list nav dense>
      <v-list-item-group color="blue darken-4">
        <v-list-item
          v-for="(module, i) in sousModules"
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
      <v-list-group
        color="blue darken-4"
        sub-group
        prepend-icon="mdi-cog"
        append-icon="mdi-chevron-right"
      >
        <template #activator>
          <v-list-item-title>Parametres</v-list-item-title>
        </template>
        <v-list-item
          v-for="(module, i) in parametersModules"
          :key="i"
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
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    restaurant: {
      type: Number,
      required: true,
    },
  },
  computed: {
    sousModules() {
      const prefix = `/externe/${this.restaurant}`
      return [
        {
          icon: 'mdi-cart',
          text: 'Articles',
          to: `${prefix}/article`,
          permission: 'acces externe articles',
        },
        {
          icon: 'mdi-food-turkey',
          text: 'Plats',
          to: `${prefix}/plat`,
          permission: 'acces externe plats',
        },
        {
          icon: 'mdi-glass-mug-variant',
          text: 'Tournées',
          to: `${prefix}/tournee`,
          permission: 'acces externe tournees',
        },
        {
          icon: 'mdi-glass-cocktail',
          text: 'Cocktails',
          to: `${prefix}/cocktail`,
          permission: 'acces externe cocktails',
        },
        {
          icon: 'mdi-warehouse',
          text: 'Inventaire',
          to: `${prefix}/inventaire`,
          permission: 'acces externe inventaire',
        },
        {
          icon: 'mdi-basket-plus',
          text: 'Depenses',
          to: `${prefix}/depense`,
          permission: 'acces externe depenses',
        },
        {
          icon: 'mdi-cash-register',
          text: 'Factures',
          to: `${prefix}/facture`,
          permission: 'acces externe factures',
        },
      ]
    },
    parametersModules() {
      const prefix = `/externe/${this.restaurant}`
      return [
        {
          icon: 'mdi-food',
          text: 'Restaurant',
          to: `${prefix}/parametre/restaurant/`,
          permission: 'acces externe restaurant',
        },
        {
          icon: 'mdi-shape',
          text: 'Categories',
          to: `${prefix}/parametre/categorie/`,
          permission: 'acces externe categories',
        },
        {
          icon: 'mdi-bank',
          text: 'Paiements & taxes',
          to: `${prefix}/parametre/finance/`,
          permission: 'acces externe finances',
        },
      ]
    },
  },
}
</script>

<style></style>
