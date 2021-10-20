export const state = () => ({
  articles: [],
})

export const getters = {
  articles: (state) => {
    return state.articles
  },
}

export const actions = {
  async getAll({ commit }, id) {
    const requete = await this.$axios.get(
      'externe/stock/articles/restaurant/' + id
    )
    commit('SET_ARTICLES', requete.data.articles)
  },
  async getTrashed({ commit }, id) {
    const requete = await this.$axios.get(
      'externe/stock/articles/restaurant/trashed/' + id
    )
    commit('SET_ARTICLES', requete.data.articles)
  },
  async getArticlesPlat({ commit }) {
    const requete = await this.$axios.get('externe/stock/articles/plat')
    commit('SET_ARTICLES', requete.data.articles)
  },
  async getArticlesTournee({ commit }) {
    const requete = await this.$axios.get('externe/stock/articles/tournee')
    commit('SET_ARTICLES', requete.data.articles)
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'externe/stock/articles/new',
      payload
    )
    dispatch('getAll', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'externe/stock/articles/' + payload.id,
      payload
    )
    dispatch('getAll', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async archiver({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'externe/stock/articles/archiver/' + payload.id
    )
    dispatch('getAll', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'externe/stock/articles/' + payload.id
    )
    dispatch('getTrashed', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async restorer({ dispatch }, payload) {
    const requete = await this.$axios.get(
      'externe/stock/articles/restorer/' + payload.id
    )
    dispatch('getTrashed', payload.restaurant_id)
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_ARTICLES(state, articles) {
    state.articles = articles
  },
}
