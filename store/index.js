export const state = () => ({
  modules: [
    {
      name: 'Dashboard',
      link: {
        icon: 'mdi-gauge',
        title: 'Dashboard',
        to: '/',
        permission: 'accès dashboard general',
      },
      sousModules: [],
    },
    {
      name: 'reception',
      link: {
        icon: 'mdi-card-account-details',
        title: 'Gestion de la Réception',
        to: '/reception',
        permission: 'accès gestion réception',
      },
      sousModules: [
        {
          icon: 'mdi-account-group',
          text: 'Gestion de la Clientelle',
          to: '/reception/clientelle',
          permission: 'acces clientelle',
        },
      ],
    },
    {
      name: 'stock',
      link: {
        icon: 'mdi-package-variant-closed',
        title: 'Gestion Du Stock',
        to: '/stock',
        permission: 'acces gestion stock',
      },
      sousModules: [
        {
          icon: 'mdi-cart',
          text: 'Articles',
          to: '/stock/produit',
          permission: 'acces article',
        },
        {
          icon: 'mdi-food-turkey',
          text: 'Plats',
          to: '/stock/plat',
          permission: 'acces plat',
        },
        {
          icon: 'mdi-glass-cocktail',
          text: 'Cocktails',
          to: '/stock/cocktail',
          permission: 'acces cocktail',
        },
        {
          icon: 'mdi-glass-mug-variant',
          text: 'Tournées',
          to: '/stock/tournee',
          permission: 'acces tournee',
        },
        {
          icon: 'mdi-message-arrow-right',
          text: 'Gestion des Demandes',
          to: '/stock/demande',
          permission: 'acces demande stock',
        },
        {
          icon: 'mdi-package-variant',
          text: 'Gestion des sorties',
          to: '/stock/sortie',
          permission: 'acces sortie',
        },
        {
          icon: 'mdi-warehouse',
          text: 'Inventaire',
          to: '/stock/inventaire',
          permission: 'acces inventaire stock',
        },
        {
          icon: 'mdi-basket-plus',
          text: 'Approvisionements',
          to: '/stock/achat',
          permission: 'acces achat',
        },
      ],
    },
    {
      name: 'restaurant',
      link: {
        icon: 'mdi-silverware-fork-knife',
        title: 'Gestion Du Restaurant',
        to: '/restaurant',
        permission: 'acces gestion restaurant',
      },
      sousModules: [
        {
          icon: 'mdi-message-arrow-right',
          text: 'Gestion des Demandes',
          to: '/restaurant/demande',
          permission: 'acces demande restau',
        },
        {
          icon: 'mdi-warehouse',
          text: 'Inventaire',
          to: '/restaurant/inventaire',
          permission: 'acces inventaire restau',
        },
        {
          icon: 'mdi-cash-register',
          text: 'Caisse',
          to: '/restaurant/caisse',
          permission: 'acces caisse restau',
        },
      ],
    },
    {
      name: 'bar',
      link: {
        icon: 'mdi-glass-mug',
        title: 'Gestion Du Bar',
        to: '/bar',
        permission: 'acces gestion bar',
      },
      sousModules: [
        {
          icon: 'mdi-message-arrow-right',
          text: 'Gestion des Demandes',
          to: '/bar/demande',
          permission: 'acces demande bar',
        },
        {
          icon: 'mdi-warehouse',
          text: 'Inventaire',
          to: '/bar/inventaire',
          permission: 'acces inventaire bar',
        },
        {
          icon: 'mdi-cash-register',
          text: 'Caisse',
          to: '/bar/caisse',
          permission: 'acces caisse bar',
        },
      ],
    },
    {
      name: 'maintenance',
      link: {
        icon: 'mdi-tools',
        title: 'Maintenance hôtel',
        to: '/maintenance',
        permission: 'acces maintenance hotel',
      },
      sousModules: [
        {
          icon: 'mdi-devices',
          text: 'Equipements',
          to: '/maintenance/fourniture',
        },
        {
          icon: 'mdi-account-tie',
          text: 'Employés',
          to: '/maintenance/employe',
        },
        {
          icon: 'mdi-account-hard-hat',
          text: 'Artisans',
          to: '/maintenance/artisan',
        },
        {
          icon: 'mdi-progress-wrench',
          text: 'Entretiens',
          to: '/maintenance/entretien',
        },
        {
          icon: 'mdi-hammer-wrench',
          text: 'Réparations',
          to: '/maintenance/reparation',
        },
      ],
    },
    {
      name: 'parametre',
      link: {
        icon: 'mdi-cog',
        title: 'Parametres',
        to: '/parametre',
        permission: 'acces gestion parametre',
      },
      sousModules: [
        {
          icon: 'mdi-shape',
          text: 'Catégories',
          to: '/parametre/categorie',
          permission: 'acces parametre categorie',
        },
        {
          icon: 'mdi-bed',
          text: 'Chambres',
          to: '/parametre/chambre',
          permission: 'acces parametre chambre',
        },
        {
          icon: 'mdi-cash',
          text: 'Paiements mobile',
          to: '/parametre/paiement-mobile',
          permission: 'acces parametre paiement',
        },
        {
          icon: 'mdi-sitemap',
          text: 'Utilisateurs & rôles',
          to: '/parametre/user-role',
          permission: 'acces parametre permission',
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
  sousModulesReception: (state) => {
    return state.modules[1].sousModules
  },
  sousModulesStock: (state) => {
    return state.modules[2].sousModules
  },
  sousModulesRestaurant: (state) => {
    return state.modules[3].sousModules
  },
  sousModulesBar: (state) => {
    return state.modules[4].sousModules
  },
  sousModulesMaintenance: (state) => {
    return state.modules[5].sousModules
  },
  sousModulesParametre: (state) => {
    return state.modules[6].sousModules
  },
  // authenticate
  isAuthenticated(state) {
    return state.auth.loggedIn
  },
  user(state) {
    return state.auth.user
  },
}

export const mutations = {}

export const actions = {}
