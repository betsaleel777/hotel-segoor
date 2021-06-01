export const state = () => ({
  modules: [
    {
      name: 'Dashboard',
      link: {
        icon: 'mdi-apps',
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
          text: 'Demandes',
          to: '/stock/demande',
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
        icon: 'mdi-silverware-clean',
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
          text: 'Demandes',
          to: '/restaurant/demande',
        },
        {
          icon: 'mdi-message-arrow-right',
          text: 'Inventaire',
          to: '/restaurant/inventaire',
        },
      ],
    },
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
}

export const mutations = {}

export const actions = {}
