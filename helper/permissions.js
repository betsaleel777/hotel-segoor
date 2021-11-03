const reception = {
  acceder: 'accès gestion réception',
  reservation: {
    acceder: 'accès réservation',
    creation: '',
    modifier: '',
    supprimer: '',
  },
  attribution: {
    acceder: 'acces hébergement',
    creation: '',
    modifier: '',
    supprimer: '',
    remise: {
      acceder: 'accès remise hébergement',
    },
  },
  facture: {
    acceder: 'accès factures réception',
    creation: '',
    modifier: '',
    supprimer: '',
  },
  paiement: {
    acceder: 'accès paiements réception',
    creation: '',
    modifier: '',
    supprimer: '',
  },
  clientelle: {
    acceder: 'acces clientelle',
    creation: '',
    modifier: '',
    supprimer: '',
  },
}
const stock = {
  acceder: 'acces gestion stock',
  article: {
    acceder: 'acces article',
    creation: 'creation article',
    modifier: 'modification article',
    supprimer: 'suppression article',
  },
  plat: {
    acceder: 'acces plat',
    creation: '',
    modifier: 'modification plat',
    supprimer: 'suppression plat',
  },
  tournee: {
    acceder: 'acces tournee',
    creation: 'creation tournee',
    modifier: 'modification tournee',
    supprimer: 'suppression tournee',
  },
  cocktails: {
    acceder: 'acces cocktail',
    creation: 'creation cocktail',
    modifier: 'modification cocktail',
    supprimer: 'suppression cocktail',
  },
  demande: {
    acceder: 'acces demande stock',
    creation: '',
    modifier: '',
    supprimer: '',
  },
  sortie: {
    acceder: 'acces sortie',
    creation: 'creation sortie',
    modifier: '',
    supprimer: '',
  },
  inventaire: {
    acceder: 'acces inventaire stock',
    creation: '',
    modifier: '',
    supprimer: '',
  },
  achat: {
    acceder: 'acces achat',
    creation: 'creation achat',
    modifier: '',
    supprimer: 'suppression achat',
  },
}

const maintenance = { acceder: 'acces maintenance hotel' }

const bar = {
  acceder: 'acces gestion bar',
  demande: {
    acceder: 'acces demande bar',
    creation: 'creation demande bar',
    modifier: 'modification demande bar',
    supprimer: '',
  },
  inventaire: {
    acceder: 'acces inventaire bar',
    creation: '',
    modifier: '',
    supprimer: '',
  },
  caisse: {
    acceder: 'acces caisse bar',
    paiement: {
      acceder: 'paiement facture bar',
    },
    facture: {
      creation: '',
      modifier: '',
    },
  },
}

const restaurant = {
  acceder: 'acces gestion restaurant',
  demande: {
    acceder: 'acces demande restau',
    creation: 'creation demande restau',
    modifier: 'modification demande restau',
    supprimer: '',
  },
  inventaire: {
    acceder: '',
    creation: '',
    modifier: '',
    supprimer: '',
  },
  caisse: {
    acceder: 'acces caisse restau',
    paiement: {
      acceder: 'paiement facture  restau',
    },
    facture: {
      creation: 'creation facture restau',
      modifier: '',
    },
  },
}

const parametre = {
  acceder: 'acces gestion parametre',
  categorie: {
    acceder: 'acces parametre categorie',
    creation: '',
    modifier: '',
    supprimer: '',
  },
  chambre: {
    acceder: 'acces parametre chambre',
    creation: '',
    modifier: '',
    supprimer: '',
  },
  mobile: {
    acceder: '',
    creation: '',
    modifier: '',
    supprimer: '',
  },
  permissions: {
    acceder: 'acces parametre permission',
    creation: '',
    modifier: '',
    supprimer: '',
  },
}

const externe = {
  acceder: 'acces externe restaurants',
  parametre: {
    acceder: 'acces externe parametre',
    categorie: {
      acceder: 'acces externe categories',
      article: {
        modifier: 'modification externe categories article',
        supprimer: 'suppression externe categories article',
        restorer: 'restorer externe categories article',
      },
      tournee: {
        modifier: 'modification externe categories tournee',
        supprimer: 'suppression externe categories tournee',
        restorer: 'restorer externe categories tournee',
      },
      plat: {
        modifier: 'modification externe categories plat',
        supprimer: 'suppression externe categories plat',
        restorer: 'restorer externe categories plat',
      },
      cocktail: {
        modifier: 'modification externe categories cocktail',
        supprimer: 'suppression externe categories cocktail',
        restorer: 'restorer externe categories cocktail',
      },
    },
    mobile: {
      acceder: 'acces externe mobiles',
      creation: 'creation externe mobiles',
      modifier: 'modification externe mobiles',
      supprimer: 'suppression externe mobiles',
      restorer: 'restorer externe mobiles',
    },
    table: {
      acceder: 'acces externe tables',
      modifier: 'modification externe tables',
      supprimer: 'suppression externe tables',
      restorer: 'restorer externe tables',
    },
  },
  article: {
    acceder: 'acces externe articles',
    creation: 'creation externe articles',
    modifier: 'modification externe articles',
    supprimer: 'suppression externe articles',
    restorer: 'restorer externe articles',
  },
  tournee: {
    acceder: 'acces externe tournees',
    creation: 'creation externe tournees',
    modifier: 'modification externe tournees',
    supprimer: 'suppression externe tournees',
    restorer: 'restorer externe tournees',
  },
  plat: {
    acceder: 'acces externe plats',
    creation: 'creation externe plats',
    modifier: 'modification externe plats',
    supprimer: 'suppression externe plats',
    restorer: 'restorer externe plats',
  },
  cocktail: {
    acceder: 'acces externe cocktails',
    creation: 'creation externe cocktails',
    modifier: 'modification externe cocktails',
    supprimer: 'suppression externe cocktails',
    restorer: 'restorer externe cocktails',
  },
  depense: {
    acceder: 'acces externe depenses',
    creation: 'creation externe depenses',
    modifier: 'modification externe depenses',
    supprimer: 'suppression externe depenses',
    restorer: 'restorer externe depenses',
  },
  facture: {
    acceder: 'acces externe factures',
    creation: 'creation externe factures',
    modifier: 'modification externe factures',
    supprimer: 'suppression externe factures',
    restorer: 'restorer externe factures',
  },
}
const parameterSet = (element) => {
  return externe.parametre.categorie[element]
}

module.exports = {
  reception,
  stock,
  bar,
  restaurant,
  parametre,
  maintenance,
  ArticleExterne: externe.article,
  PlatExterne: externe.plat,
  CocktailExterne: externe.cocktail,
  TourneeExterne: externe.tournee,
  DepenseExterne: externe.depense,
  FactureExterne: externe.facture,
  ParametreMobileExterne: externe.parametre.mobile,
  ParametreTableExterne: externe.parametre.table,
  ParametreCategorieExterne: externe.parametre.categorie,
  ParametreCategorieArticleExterne: externe.parametre.categorie.article,
  ParametreCategorieTourneeExterne: externe.parametre.categorie.tournee,
  ParametreCategoriePlatExterne: externe.parametre.categorie.plat,
  ParametreCategorieCocktailExterne: externe.parametre.categorie.cocktail,
  parameterSet,
}