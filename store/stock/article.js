export const state = () => ({
  articles: [],
})
export const getters = {
  articles: (state) => {
    return state.articles
  },
}
export const actions = {
  async getAll({ commit }) {
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
    commit('ALL_ARTICLES', articles)
  },
  async getArticlesStockes({ commit }) {
    const requete = await this.$axios.get('stock/produits/inventaire')
    const articles = requete.data.inventaire
    commit('ALL_ARTICLES', articles)
  },
  async getArticlesTournee({ commit }) {
    const requete = await this.$axios.get('stock/produits/tournees')
    const articles = requete.data.produits
    commit('ALL_ARTICLES', articles)
  },
  async getArticlesDepartement({ commit }, departement) {
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
    commit('ALL_ARTICLES', articles)
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
}

export const mutations = {
  ALL_ARTICLES(state, articles) {
    state.articles = articles
  },
}
