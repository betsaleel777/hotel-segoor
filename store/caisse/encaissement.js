import moment from 'moment'
import collect from 'collect.js'
export const state = () => ({
  encaissements: [],
  encaissementsSoldes: [],
  encaissementsCompactes: [],
})
export const getters = {
  encaissements: (state) => {
    return state.encaissements
  },
  encaissementsSoldes: (state) => {
    return state.encaissementsSoldes
  },
  encaissementsCompactes: (state) => {
    return state.encaissementsCompactes
  },
}
const somme = function (encaissement) {
  const { plats, tournees, cocktails, produits } = encaissement
  let resultat = 0
  plats.forEach((plat) => {
    resultat += plat.pivot.prix_vente * plat.pivot.quantite
  })
  tournees.forEach((tournee) => {
    resultat += tournee.pivot.prix_vente * tournee.pivot.quantite
  })
  cocktails.forEach((cocktail) => {
    resultat += cocktail.pivot.prix_vente * cocktail.pivot.quantite
  })
  produits.forEach((produit) => {
    resultat += produit.pivot.prix_vente * produit.pivot.quantite
  })
  return resultat
}
const sommeEspece = function (versements) {
  let sum = 0
  versements.forEach((versement) => {
    if (versement.espece) sum += versement.montant - versement.monnaie
  })
  return sum
}
const sommeMobile = function (versements) {
  let sum = 0
  versements.forEach((versement) => {
    if (versement.mobile_money) sum += versement.montant - versement.monnaie
  })
  return sum
}
const sommeCheque = function (versements) {
  let sum = 0
  versements.forEach((versement) => {
    if (versement.cheque) sum += versement.montant - versement.monnaie
  })
  return sum
}
const reformatage = function (elements, genre) {
  return elements.map((element) => {
    if (genre === 'tournees') {
      const { titre, ...reste } = element
      return { nom: titre, genre: 'tournees', ...reste }
    } else if (genre === 'boissons') {
      return { genre, ...element }
    } else if (genre === 'cocktails') {
      return { genre, ...element }
    } else {
      return { genre, ...element }
    }
  })
}
const sommeVersee = function (versements) {
  let somme = 0
  versements.forEach((versement) => {
    somme += versement.montant - versement.monnaie
  })
  return somme
}
const reformatageClient = function (hebergement) {
  if (hebergement)
    return (
      hebergement.client_linked.nom + ' ' + hebergement.client_linked.prenom
    )
  return 'Anonyme'
}
const organiser = function (encaissements) {
  return encaissements.map((encaissement) => {
    const { versements, date_soldee: time, id } = encaissement
    return {
      id,
      date_soldee: moment(time).format('YYYY-MM-DD'),
      espece: sommeEspece(versements),
      cheque: sommeCheque(versements),
      mobile: sommeMobile(versements),
    }
  })
}
export const actions = {
  async getAll({ commit }) {
    commit('SET_ENCAISSEMENT', [])
    const requete = await this.$axios.get('caisses/encaissements')
    const encaissements = requete.data.encaissements
    commit('SET_ENCAISSEMENT', encaissements)
  },
  async getEncaissements({ commit }, departement = 1) {
    commit('SET_ENCAISSEMENT', [])
    const requete = await this.$axios.get(
      'caisses/encaissements/departement/' + departement
    )
    const encaissements = requete.data.encaissements.map((encaissement) => {
      const { tournees, plats, cocktails, produits, versements } = encaissement
      return {
        id: encaissement.id,
        code: encaissement.code,
        created_at: moment(encaissement.created_at).format('ll'),
        status: encaissement.status,
        attribution_linked: encaissement.attribution_linked,
        client: reformatageClient(encaissement.attribution_linked),
        produits: reformatage(produits, 'boissons'),
        plats: reformatage(plats, 'plats'),
        tournees: reformatage(tournees, 'tournees'),
        cocktails: reformatage(cocktails, 'cocktails'),
        zone: encaissement.zone,
        montant: somme(encaissement),
        verse: sommeVersee(versements),
        versements,
      }
    })
    commit('SET_ENCAISSEMENT', encaissements)
  },
  async getEncaissementsSoldes({ commit }, departement = 1) {
    commit('SET_SOLDES', [])
    const requete = await this.$axios.get(
      'caisses/encaissements/soldes/departement/' + departement
    )
    const encaissements = requete.data.encaissements.map((encaissement) => {
      const { tournees, plats, cocktails, produits, versements } = encaissement
      return {
        id: encaissement.id,
        code: encaissement.code,
        created_at: encaissement.created_at,
        date_soldee: moment(encaissement.date_soldee).format('YYYY-MM-DD'),
        produits: reformatage(produits, 'boissons'),
        plats: reformatage(plats, 'plats'),
        tournees: reformatage(tournees, 'tournees'),
        cocktails: reformatage(cocktails, 'cocktails'),
        zone: encaissement.zone,
        montant: somme(encaissement),
        versements,
      }
    })
    commit('SET_SOLDES', encaissements)
  },
  async getCompact({ commit, dispatch }, departement = 1) {
    commit('SET_COMPACT', [])
    const requete = await this.$axios.get(
      'caisses/encaissements/soldes/departement/' + departement
    )
    let encaissements = organiser(requete.data.encaissements)
    encaissements = collect(encaissements)
      .groupBy('date_soldee')
      .map((lignes, index) => {
        let cheque = 0
        let mobile = 0
        let espece = 0
        lignes.all().forEach((ligne) => {
          mobile += Number(ligne.mobile)
          cheque += Number(ligne.cheque)
          espece += Number(ligne.espece)
        })
        return { mobile, cheque, espece, date_soldee: index }
      })
      .toArray()
    commit('SET_COMPACT', encaissements)
  },
  async getItemElement({ commit }, id) {
    const requete = await this.$axios.get('caisses/encaissements/' + id)
    const encaissement = requete.data.encaissement
    const { tournees, plats, cocktails, produits, versements } = encaissement
    return {
      id: encaissement.id,
      code: encaissement.code,
      created_at: moment(encaissement.created_at).format('ll'),
      status: encaissement.status,
      attribution_linked: encaissement.attribution_linked,
      client: reformatageClient(encaissement.attribution_linked),
      produits: reformatage(produits, 'boissons'),
      plats: reformatage(plats, 'plats'),
      tournees: reformatage(tournees, 'tournees'),
      cocktails: reformatage(cocktails, 'cocktails'),
      zone: encaissement.zone,
      montant: somme(encaissement),
      verse: sommeVersee(versements),
      versements,
    }
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'caisses/encaissements/' + payload.id,
      payload
    )
    payload.departement
      ? dispatch('getEncaissements', payload.departement)
      : dispatch('getEncaissements')
    // dispatch from module to another module dispatch('/someAction', null, { root: true })
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('caisses/encaissements/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post('caisses/encaissements/new', payload)
    payload.departement
      ? dispatch('getEncaissements', payload.departement)
      : dispatch('getEncaissements')
    return { message: requete.data.message }
  },
  async encaisser({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'caisses/encaissements/versement',
      payload
    )
    payload.departement
      ? dispatch('getEncaissements', payload.departement)
      : dispatch('getEncaissements')
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_ENCAISSEMENT(state, encaissements) {
    state.encaissements = encaissements
  },
  SET_SOLDES(state, encaissementsSoldes) {
    state.encaissementsSoldes = encaissementsSoldes
  },
  SET_COMPACT(state, encaissementsCompactes) {
    state.encaissementsCompactes = encaissementsCompactes
  },
}
