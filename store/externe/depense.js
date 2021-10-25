import collect from 'collect.js'
import moment from 'moment'
export const state = () => ({
  depenses: [],
  depensesDatesCompactees: [],
})

export const getters = {
  depenses: (state) => {
    return state.depenses
  },
  depensesDatesCompactees: (state) => {
    return state.depensesDatesCompactees
  },
}

const organiser = (depenses) => {
  return depenses.map((depense) => {
    const { articles, ...rest } = depense
    let montant = 0
    const pannier = articles.map((article) => {
      montant += Number(article.pivot.quantite) * Number(article.pivot.cout)
      return {
        id: article.pivot.article_id,
        quantite: article.pivot.quantite,
        prix: article.pivot.cout,
        montant: Number(article.pivot.quantite) * Number(article.pivot.cout),
      }
    })
    return {
      ...rest,
      group_date: moment(rest.created_at).format('YYYY-MM-DD'),
      pannier,
      montant,
    }
  })
}

export const actions = {
  async getAll({ commit }, restaurant) {
    commit('SET_DEPENSES', [])
    const requete = await this.$axios.get(
      'externe/stock/depenses/restaurant/' + restaurant
    )
    commit('SET_DEPENSES', organiser(requete.data.depenses))
  },
  async getByDate({ commit }, payload) {
    commit('SET_DEPENSES', [])
    const requete = await this.$axios.get(
      `externe/stock/depenses/restaurant/${payload.restaurant_id}/date/${payload.jour}`
    )
    commit('SET_DEPENSES', organiser(requete.data.depenses))
  },
  async getCompactees({ commit }, restaurant) {
    commit('SET_COMPACTES', [])
    const requete = await this.$axios.get(
      'externe/stock/depenses/restaurant/' + restaurant
    )
    let depenses = organiser(requete.data.depenses)
    depenses = collect(depenses)
      .groupBy('group_date')
      .map((lignes, index) => {
        let montant = 0
        lignes.all().forEach((ligne) => {
          montant += Number(ligne.montant)
        })
        return { montant, jour: index }
      })
      .toArray()
    commit('SET_COMPACTES', depenses)
  },
  async getTrashed({ commit }, restaurant) {
    commit('SET_DEPENSES', [])
    const requete = await this.$axios.get(
      'externe/stock/depenses/restaurant/trashed/' + restaurant
    )
    commit('SET_DEPENSES', requete.data.depenses)
  },
  async getTrashedByDate({ commit }, payload) {
    commit('SET_DEPENSES', [])
    const requete = await this.$axios.get(
      `externe/stock/depenses/restaurant/trashed/${payload.restaurant_id}/date/${payload.jour}`
    )
    commit('SET_DEPENSES', organiser(requete.data.depenses))
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'externe/stock/depenses/new',
      payload
    )
    dispatch('getCompactees', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'externe/stock/depenses/' + payload.id,
      payload
    )
    dispatch('getByDate', payload)
    return { message: requete.data.message }
  },
  async archiver({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'externe/stock/depenses/archiver/' + payload.id
    )
    dispatch('getByDate', payload)
    return { message: requete.data.message }
  },
  async restorer({ dispatch }, payload) {
    const requete = await this.$axios.get(
      'externe/stock/depenses/restorer/' + payload.id
    )
    dispatch('getTrashedByDate', payload)
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'externe/stock/depenses/' + payload.id
    )
    dispatch('getTrashed', payload.restaurant_id)
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_DEPENSES(state, depenses) {
    state.depenses = depenses
  },
  SET_COMPACTES(state, depensesDatesCompactees) {
    state.depensesDatesCompactees = depensesDatesCompactees
  },
}
