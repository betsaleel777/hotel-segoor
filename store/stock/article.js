export const state = () => ({
  articles: [],
  disponibles: [],
})
export const getters = {
  articles: (state) => {
    return state.articles
  },
  disponibles: (state) => {
    return state.disponibles
  },
}
export const actions = {
  async getAll({ commit }) {
    commit('SET_ARTICLES', [])
    const requete = await this.$axios.get('stock/produits')
    const articles = requete.data.produits.map((article) => {
      const imageData = article.image ? article.image : []
      const mesureData = article.mesure ? article.mesure : ''
      return {
        id: article.id,
        code: article.code,
        mesure: mesureData,
        nom: article.nom,
        image: imageData,
        montant: article.prix_vente,
        pour_plat: article.pour_plat,
        pour_tournee: article.pour_tournee,
        mode: article.mode,
        type: article.type,
        etagere: article.etagere ? article.etagere : '',
        description: article.description ? article.description : '',
        categorie: {
          id: article.categorie_linked.id,
          nom: article.categorie_linked.nom,
        },
      }
    })
    commit('SET_ARTICLES', articles)
  },
  async getArticlesStockes({ commit }) {
    commit('SET_ARTICLES', [])
    const requete = await this.$axios.get('stock/produits/inventaire')
    const articles = requete.data.inventaire
    commit('SET_ARTICLES', articles)
  },
  async getArticlesTournee({ commit }) {
    commit('SET_ARTICLES', [])
    const requete = await this.$axios.get('stock/produits/tournees')
    const articles = requete.data.produits
    commit('SET_ARTICLES', articles)
  },
  async getArticlesDepartement({ commit }, departement) {
    commit('SET_ARTICLES', [])
    const requete = await this.$axios.get(
      'stock/demandes/inventaire/' + departement
    )
    let articles = requete.data.inventaire.filter(
      (article) => article.pour_plat !== 1
    )
    articles = articles.map((article) => {
      const { produit, ...rest } = article
      return { ...rest, id: produit, genre: 'boissons', valeur: 0 }
    })
    commit('SET_ARTICLES', articles)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'stock/produits/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('stock/produits/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post('stock/produits/new', payload)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async disponible({ commit }, id) {
    let requete = null
    if (id) requete = await this.$axios.get('stock/produits/disponibles/' + id)
    else requete = await this.$axios.get('stock/produits/disponibles')
    commit('SET_DISPONIBLES', requete.data.disponibles)
  },
}

export const mutations = {
  SET_ARTICLES(state, articles) {
    state.articles = articles
  },
  SET_DISPONIBLES(state, disponibles) {
    state.disponibles = disponibles
  },
}
