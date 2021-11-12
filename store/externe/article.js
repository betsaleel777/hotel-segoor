export const state = () => ({
  articles: [],
  inventaire: [],
})

export const getters = {
  articles: (state) => {
    return state.articles
  },
  inventaire: (state) => {
    return state.inventaire
  },
}

export const actions = {
  async getAll({ commit }, id) {
    commit('SET_ARTICLES', [])
    const requete = await this.$axios.get(
      'externe/stock/articles/restaurant/' + id
    )
    commit('SET_ARTICLES', requete.data.articles)
  },
  async getArticles({ commit }, id) {
    commit('SET_ARTICLES', [])
    const requete = await this.$axios.get(
      'externe/stock/articles/restaurant/' + id
    )
    let articles = requete.data.articles.filter(
      (article) =>
        article.pour_plat !== 1 &&
        article.pour_tournee !== 1 &&
        article.pour_cocktail !== 1
    )
    articles = articles.map((article) => {
      const { id, code, prix_vente: prix, nom } = article
      return { id, code, nom, prix, genre: 'autres' }
    })
    commit('SET_ARTICLES', articles)
  },
  async getTrashed({ commit }, id) {
    commit('SET_ARTICLES', [])
    const requete = await this.$axios.get(
      'externe/stock/articles/restaurant/trashed/' + id
    )
    commit('SET_ARTICLES', requete.data.articles)
  },
  async getArticlesPlat({ commit }, restaurant) {
    const requete = await this.$axios.get(
      'externe/stock/articles/plat/' + restaurant
    )
    commit('SET_ARTICLES', requete.data.articles)
  },
  async getArticlesTournee({ commit }, restaurant) {
    const requete = await this.$axios.get(
      'externe/stock/articles/tournee/' + restaurant
    )
    commit('SET_ARTICLES', requete.data.articles)
  },
  async getInventaire({ commit }, restaurant) {
    commit('SET_INVENTAIRE', [])
    const requete = await this.$axios.get(
      'externe/stock/articles/inventaire/' + restaurant
    )
    // devrait se faire directement par la requette d'inventaire
    const trashed = await this.$axios.get(
      'externe/stock/articles/restaurant/trashed/' + restaurant
    )
    const articles = requete.data.articles.map((article) => {
      const found = trashed.data.articles.find(
        (trashed) => trashed.id === article.id
      )
      return found
        ? { ...article, archive: true }
        : { ...article, archive: false }
    })
    commit('SET_INVENTAIRE', articles)
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
  SET_INVENTAIRE(state, inventaire) {
    state.inventaire = inventaire
  },
}
