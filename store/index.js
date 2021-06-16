export const state = () => ({
  modules: [
    {
      name: 'Dashboard',
      link: {
        icon: 'mdi-gauge',
        title: 'Dashboard',
        to: '/',
      },
      sousModules: [],
    },
    {
      name: 'gestionChambre',
      link: {
        icon: 'mdi-home-city',
        title: 'Gestion des chambres',
        to: '/gestion-chambre',
      },
      sousModules: [
        {
          icon: 'mdi-bed',
          text: 'Chambres',
          to: '/gestion-chambre/chambre',
        },
        {
          icon: 'mdi-cog',
          text: 'Maintenances',
          to: '/gestion-chambre/maintenance',
        },
      ],
    },
    {
      name: 'reception',
      link: {
        icon: 'mdi-card-account-details',
        title: 'Gestion de la Réception',
        to: '/reception',
      },
      sousModules: [
        {
          icon: 'mdi-home',
          text: 'Hall  de Réception',
          to: '/reception/hall',
        },
        {
          icon: 'mdi-shield-home',
          text: 'Réservation',
          to: '/reception/reservation',
        },
        {
          icon: 'mdi-account-group',
          text: 'Clientelle',
          to: '/reception/clientelle',
        },
        {
          icon: 'mdi-cash',
          text: 'Caisse',
          to: '/reception/caisse',
        },
      ],
    },
    {
      name: 'stock',
      link: {
        icon: 'mdi-package-variant-closed',
        title: 'Gestion Du Stock',
        to: '/stock',
      },
      sousModules: [
        {
          icon: 'mdi-cart',
          text: 'Articles',
          to: '/stock/produit',
        },
        {
          icon: 'mdi-message-arrow-right',
          text: 'Gestion des Demandes',
          to: '/stock/demande',
        },
        {
          icon: 'mdi-package-variant',
          text: 'Gestion des sorties',
          to: '/stock/sortie',
        },
        {
          icon: 'mdi-warehouse',
          text: 'Inventaire',
          to: '/stock/inventaire',
        },
        {
          icon: 'mdi-basket-plus',
          text: 'Approvisionements',
          to: '/stock/achat',
        },
      ],
    },
    {
      name: 'restaurant',
      link: {
        icon: 'mdi-silverware-fork-knife',
        title: 'Gestion Du Restaurant',
        to: '/restaurant',
      },
      sousModules: [
        {
          icon: 'mdi-food-turkey',
          text: 'Plats',
          to: '/restaurant/plat',
        },
        {
          icon: 'mdi-message-arrow-right',
          text: 'Gestion des Demandes',
          to: '/restaurant/demande',
        },
        {
          icon: 'mdi-warehouse',
          text: 'Inventaire',
          to: '/restaurant/inventaire',
        },
        {
          icon: 'mdi-cash',
          text: 'Caisse',
          to: '/restaurant/caisse',
        },
      ],
    },
    {
      name: 'bar',
      link: {
        icon: 'mdi-glass-mug',
        title: 'Gestion Du Bar',
        to: '/bar',
      },
      sousModules: [
        {
          icon: 'mdi-glass-cocktail',
          text: 'Cocktails',
          to: '/bar/cocktail',
        },
        {
          icon: 'mdi-glass-mug-variant',
          text: 'Tournées',
          to: '/bar/tournee',
        },
        {
          icon: 'mdi-message-arrow-right',
          text: 'Gestion des Demandes',
          to: '/bar/demande',
        },
        {
          icon: 'mdi-warehouse',
          text: 'Inventaire',
          to: '/bar/inventaire',
        },
        {
          icon: 'mdi-cash',
          text: 'Caisse',
          to: '/bar/caisse',
        },
      ],
    },
    // {
    //   name: 'parametre',
    //   link: {
    //     icon: 'mdi-cogs',
    //     title: 'Parametres',
    //     to: '/parametre',
    //   },
    //   sousModules: [
    //     {
    //       icon: 'mdi-currency-usd',
    //       text: 'Prix des Articles',
    //       to: '/parametre/cocktail',
    //     },
    //   ],
    // },
  ],
})

export const getters = {
  modules: (state) => {
    return state.modules.map((element) => {
      return element.link
    })
  },
  sousModulesChambre: (state) => {
    return state.modules[1].sousModules
  },
  sousModulesReception: (state) => {
    return state.modules[2].sousModules
  },
  sousModulesStock: (state) => {
    return state.modules[3].sousModules
  },
  sousModulesRestaurant: (state) => {
    return state.modules[4].sousModules
  },
  sousModulesBar: (state) => {
    return state.modules[5].sousModules
  },
  // sousModulesParametre: (state) => {
  //   return state.modules[6].sousModules
  // },
}

export const mutations = {}

export const actions = {}
