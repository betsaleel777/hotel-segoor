import collect from 'collect.js'
// import moment from 'moment'
export const state = () => ({
  factures: [],
  soldees: [],
  nonSoldees: [],
})

export const getters = {
  factures: (state) => {
    return state.factures
  },
  soldees: (state) => {
    return state.soldees
  },
  nonSoldees: (state) => {
    return state.nonSoldees
  },
}
const reassembler = (facture) => {
  const { paiements, articles, plats, cocktails, tournees, ...rest } = facture
  let verse = 0
  let montant = 0
  if (paiements.length > 0) {
    paiements.forEach((paiement) => {
      verse += Number(paiement.montant) - Number(paiement.monnaie)
    })
  }
  articles.forEach((article) => {
    article.genre = 'autres'
  })
  plats.forEach((plat) => {
    plat.genre = 'plats'
  })
  cocktails.forEach((cocktail) => {
    cocktail.genre = 'cocktails'
  })
  tournees.forEach((tournee) => {
    tournee.genre = 'tournees'
  })
  const selected = [...articles, ...plats, ...cocktails, ...tournees]
  selected.forEach((select) => {
    montant += Number(select.pivot.prix_vente) * Number(select.pivot.quantite)
  })
  return { montant, verse, selected, paiements, ...rest }
}

const organiser = (factures) => {
  return factures.map(reassembler)
}

export const actions = {
  async getAll({ commit }, restaurant) {
    commit('SET_FACTURES', [])
    const requete = await this.$axios.get(
      'externe/caisse/factures/restaurant/' + restaurant
    )
    commit('SET_FACTURES', organiser(requete.data.factures))
  },
  async getItem({ commit }, id) {
    const requete = await this.$axios.get('externe/caisse/factures/' + id)
    return reassembler(requete.data.facture)
  },
  async getByDate({ commit }, payload) {
    commit('SET_FACTURES', [])
    const requete = await this.$axios.get(
      `externe/caisse/factures/restaurant/${payload.restaurant_id}/date/${payload.jour}`
    )
    commit('SET_FACTURES', organiser(requete.data.factures))
  },
  async getSoldees({ commit }, restaurant) {
    commit('SET_COMPACTES', [])
    const requete = await this.$axios.get(
      'externe/caisse/factures/restaurant/soldees/' + restaurant
    )
    let factures = organiser(requete.data.factures)
    factures = collect(factures)
      .groupBy('group_date')
      .map((lignes, index) => {
        let montant = 0
        lignes.all().forEach((ligne) => {
          montant += Number(ligne.montant)
        })
        return { montant, jour: index }
      })
      .toArray()
    commit('SET_COMPACTES', factures)
  },
  async getNonSoldees({ commit }, restaurant) {
    commit('SET_NON_SOLDEES', [])
    const requete = await this.$axios.get(
      'externe/caisse/factures/restaurant/nonSoldees/' + restaurant
    )
    const factures = organiser(requete.data.factures)
    commit('SET_NON_SOLDEES', factures)
  },
  async getTrashed({ commit }, restaurant) {
    commit('SET_FACTURES', [])
    const requete = await this.$axios.get(
      'externe/caisse/factures/restaurant/trashed/' + restaurant
    )
    commit('SET_FACTURES', requete.data.factures)
  },
  async getTrashedByDate({ commit }, payload) {
    commit('SET_FACTURES', [])
    const requete = await this.$axios.get(
      `externe/caisse/factures/restaurant/trashed/${payload.restaurant_id}/date/${payload.jour}`
    )
    commit('SET_FACTURES', organiser(requete.data.factures))
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'externe/caisse/factures/new',
      payload
    )
    dispatch('getNonSoldees', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'externe/caisse/factures/' + payload.id,
      payload
    )
    dispatch('getNonSoldees', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async archiver({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'externe/caisse/factures/archiver/' + payload.id
    )
    dispatch('getByDate', payload)
    return { message: requete.data.message }
  },
  async restorer({ dispatch }, payload) {
    const requete = await this.$axios.get(
      'externe/caisse/factures/restorer/' + payload.id
    )
    dispatch('getTrashedByDate', payload)
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'externe/caisse/factures/' + payload.id
    )
    dispatch('getTrashed', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async encaisser({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'externe/caisse/paiements/new',
      payload
    )
    dispatch('getNonSoldees', payload.restaurant_id)
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_FACTURES(state, factures) {
    state.factures = factures
  },
  SET_NON_SOLDEES(state, nonSoldees) {
    state.nonSoldees = nonSoldees
  },
  SET_COMPACTES(state, soldees) {
    state.soldees = soldees
  },
}
