import moment from 'moment'
export const state = () => ({
  attributions: [],
  hebergements: [],
  attributionsEnCours: [],
  attribution: {},
})
export const getters = {
  attributions: (state) => {
    return state.attributions
  },
  attributionsEnCours: (state) => {
    return state.attributionsEnCours
  },
  attribution: (state) => {
    return state.attribution
  },
  hebergements: (state) => {
    return state.hebergements
  },
}
const texteConsommation = function (consommations) {
  if (consommations.length > 0) {
    let texte = ''
    consommations.forEach((conso) => {
      const { plats, tournees, cocktails, produits } = conso
      plats.forEach((plat) => {
        texte += `${plat.nom}(${plat.pivot.quantite}*${
          plat.pivot.prix_vente
        }=<b>${plat.pivot.prix_vente * plat.pivot.quantite}</b> FCFA),`
      })
      cocktails.forEach((cocktail) => {
        texte += `${cocktail.nom}(${cocktail.pivot.quantite}*${
          cocktail.pivot.prix_vente
        }=<b>${cocktail.pivot.prix_vente * cocktail.pivot.quantite}</b> FCFA),`
      })
      if (produits) {
        produits.forEach((produit) => {
          texte += `${produit.nom}(${produit.pivot.quantite}*${
            produit.pivot.prix_vente
          }=<b>${produit.pivot.prix_vente * produit.pivot.quantite}</b> FCFA),`
        })
      }
      tournees.forEach((tournee) => {
        texte += `${tournee.titre}(${tournee.pivot.quantite}*${
          tournee.pivot.prix_vente
        }=<b>${tournee.pivot.prix_vente * tournee.pivot.quantite}</b> FCFA),`
      })
      return texte
    })
  } else {
    return 'Aucune consommation dans les service bar et restaurant'
  }
}
const texteDescription = function ({
  entree,
  sortie,
  prix,
  remise,
  consommations,
}) {
  return `nuits: ${moment(sortie).diff(entree, 'days')},
          prix: ${prix} FCFA/nuit,
          remise: ${Math.round(prix * (1 - remise / 100))} FCFA<br>
          ${texteConsommation(consommations)}`
}
const aPayer = function ({ entree, sortie, prix, remise }) {
  return remise === undefined
    ? moment(sortie).diff(entree, 'days') * prix
    : moment(sortie).diff(entree, 'days') *
        Math.round(prix * (1 - remise / 100))
}
const somme = function (versements) {
  let sum = 0
  if (versements) {
    versements.forEach((versement) => {
      sum += versement.montant - versement.monnaie
    })
  }
  return sum
}
const sommeConsommations = function (consommations) {
  let sum = 0
  if (consommations.length > 0) {
    consommations.forEach((consommation) => {
      const { plats, tournees, cocktails, produits } = consommation
      plats.forEach((plat) => {
        sum += plat.pivot.prix_vente * plat.pivot.quantite
      })
      cocktails.forEach((cocktail) => {
        sum += cocktail.pivot.prix_vente * cocktail.pivot.quantite
      })
      if (produits) {
        produits.forEach((produit) => {
          sum += produit.pivot.prix_vente * produit.pivot.quantite
        })
      }
      tournees.forEach((tournee) => {
        sum += tournee.pivot.prix_vente * tournee.pivot.quantite
      })
    })
  }
  return sum
}
export const actions = {
  async getAll({ commit }) {
    commit('SET_ATTRIBUTIONS', [])
    const requete = await this.$axios.get('reception/attributions')
    const attributions = requete.data.attributions
    commit('SET_ATTRIBUTIONS', attributions)
  },
  async getBusy({ commit }) {
    commit('SET_ATTRIBUTIONS', [])
    const requete = await this.$axios.get('reception/attributions/busy')
    const attributions = requete.data.attributions.map((attribution) => {
      return {
        ...attribution,
        montant: aPayer(attribution),
        verse: somme(attribution?.encaissement?.versements),
        consommation: sommeConsommations(attribution?.consommations),
      }
    })
    commit('SET_ATTRIBUTIONS', attributions)
  },
  async getHebergements({ commit }) {
    commit('SET_HEBERGEMENTS', [])
    const requete = await this.$axios.get('reception/attributions/used')
    const hebergements = requete.data.hebergements
    commit('SET_HEBERGEMENTS', hebergements)
  },
  async getEnCours({ commit }) {
    commit('ATTRIBUTIONS_EN_COURS', [])
    const requete = await this.$axios.get('reception/attributions/busy')
    const filtrees = requete.data.attributions.filter(
      (attribution) => attribution.status === 'occupée'
    )
    const attributions = filtrees.map((attribution) => {
      return {
        id: attribution.id,
        nom: `Chambre ${attribution.chambre_linked.nom} ${attribution.client_linked.nom} ${attribution.client_linked.prenom}`,
        prix: attribution.prix,
        remise: attribution.remise,
      }
    })
    commit('ATTRIBUTIONS_EN_COURS', attributions)
  },
  async getUniq({ commit }, id) {
    commit('ONE_ATTRIBUTION', [])
    const requete = await this.$axios.get('reception/attributions/' + id)
    const attribution = requete.data.attribution
    commit('ONE_ATTRIBUTION', attribution)
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'reception/attributions/new',
      payload
    )
    dispatch('getBusy')
    return { message: requete.data.message }
  },
  async attribuer({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'reception/attributions/new',
      payload
    )
    dispatch('getBusy')
    return { message: requete.data.message }
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'reception/attributions/' + payload.id,
      payload
    )
    dispatch('getBusy')
    return { message: requete.data.message }
  },
  async modifierCalendrier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'reception/attributions/event/' + payload.id,
      payload
    )
    dispatch('getBusy')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('reception/attributions/' + id)
    dispatch('getBusy')
    return { message: requete.data.message }
  },
  async liberer({ dispatch }, id) {
    const requete = await this.$axios.put('reception/attributions/free/' + id)
    dispatch('getBusy')
    return { message: requete.data.message }
  },
  async getByRoom({ commit }, id) {
    commit('SET_ATTRIBUTIONS', [])
    const requete = await this.$axios.get('reception/attributions/room/' + id)
    const attributions = requete.data.attributions.map((attribution) => {
      const consommation = sommeConsommations(attribution.consommations)
      const nuitees = aPayer(attribution)
      const description = texteDescription(attribution)
      return {
        ...attribution,
        consommation,
        nuitees,
        total: nuitees + consommation,
        description,
      }
    })
    commit('SET_ATTRIBUTIONS', attributions)
  },
}

export const mutations = {
  SET_ATTRIBUTIONS(state, attributions) {
    state.attributions = attributions
  },
  ATTRIBUTIONS_EN_COURS(state, attributions) {
    state.attributionsEnCours = attributions
  },
  ONE_ATTRIBUTION(state, attribution) {
    state.attribution = attribution
  },
  SET_HEBERGEMENTS(state, hebergements) {
    state.hebergements = hebergements
  },
}
