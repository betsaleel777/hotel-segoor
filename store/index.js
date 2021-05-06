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
          icon: 'mdi-bed-empty',
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
        icon: 'mdi-human-greeting',
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
      name: 'restaurant',
      link: {
        icon: 'mdi-silverware-clean',
        title: 'Gestion Du Restaurant',
        to: '/restaurant',
      },
      sousModules: [
        {
          icon: 'mdi-cart',
          text: 'Produits',
          to: '/restaurant/produit',
        },
        {
          icon: 'mdi-basket-plus',
          text: 'Approvisionements',
          to: '/restaurant/achat',
        },
        {
          icon: 'mdi-food-turkey',
          text: 'Plats',
          to: '/restaurant/plat',
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
  sousModulesRestaurant: (state) => {
    return state.modules[3].sousModules
  },
}

export const mutations = {}

export const actions = {}
