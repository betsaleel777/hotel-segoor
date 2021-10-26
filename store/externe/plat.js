export const state = () => ({
  plats: [],
})

export const getters = {
  plats: (state) => {
    return state.plats
  },
}

export const actions = {
  async getAll({ commit }, restaurant) {
    commit('SET_PLATS', [])
    const requete = await this.$axios.get(
      'externe/stock/plats/restaurant/' + restaurant
    )
    const plats = requete.data.plats.map((plat) => {
      const { articles, ...rest } = plat
      const ingredients = articles.map((article) => {
        return {
          id: article.pivot.article_id,
          quantite: article.pivot.quantite,
        }
      })
      return { ...rest, articles: ingredients }
    })
    commit('SET_PLATS', plats)
  },
  async getTrashed({ commit }, restaurant) {
    commit('SET_PLATS', [])
    const requete = await this.$axios.get(
      'externe/stock/plats/restaurant/trashed/' + restaurant
    )
    commit('SET_PLATS', requete.data.plats)
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post('externe/stock/plats/new', payload)
    dispatch('getAll', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'externe/stock/plats/' + payload.id,
      payload
    )
    dispatch('getAll', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async archiver({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'externe/stock/plats/archiver/' + payload.id
    )
    dispatch('getAll', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async restorer({ dispatch }, payload) {
    const requete = await this.$axios.get(
      'externe/stock/plats/restorer/' + payload.id
    )
    dispatch('getTrashed', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'externe/stock/plats/' + payload.id
    )
    dispatch('getTrashed', payload.restaurant_id)
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_PLATS(state, plats) {
    state.plats = plats
  },
}
