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
        icon: 'mdi-apps',
        title: 'Reception',
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
}

export const mutations = {}

export const actions = {}
