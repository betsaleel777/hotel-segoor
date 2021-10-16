<template>
  <v-navigation-drawer permanent>
    <v-list nav dense>
      <v-list-item-group color="blue darken-4">
        <v-list-item
          v-for="(module, i) in sousModules"
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
      </v-list-item-group>
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
          permission: 'acces externe depense',
        },
        {
          icon: 'mdi-cash-register',
          text: 'Factures',
          to: `${prefix}/facture`,
          permission: 'acces externe facture',
        },
      ]
    },
  },
}
</script>

<style></style>
