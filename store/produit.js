export const state = () => ({
  produits: [],
})

export const getters = {
  produits: (state) => {
    return state.produits
  },
}

export const actions = {
  async getAllProducts({ commit }) {
    commit('SET_PRODUCTS', [])
    const requete = await this.$axios.get('stock/produits')
    commit('SET_PRODUCTS', requete.data.produits)
  },
  async getBoissons({ commit }) {
    commit('SET_PRODUCTS', [])
    const requete = await this.$axios.get('stock/produits/boissons')
    commit('SET_PRODUCTS', requete.data.produits)
  },
  async getPlatsProducts({ commit }) {
    commit('SET_PRODUCTS', [])
    const requete = await this.$axios.get('stock/produits/plats')
    commit('SET_PRODUCTS', requete.data.produits)
  },
  async getTourneesProducts({ commit }) {
    commit('SET_PRODUCTS', [])
    const requete = await this.$axios.get('stock/produits/tournees')
    commit('SET_PRODUCTS', requete.data.produits)
  },
  async getInventory({ commit }) {
    commit('SET_PRODUCTS', [])
    const requete = await this.$axios.get('stock/produits/inventaire/sortie')
    const inventaire = requete.data.inventaire.map((produit) => {
      return { ...produit, virtuel: produit.disponible }
    })
    commit('SET_PRODUCTS', inventaire)
  },
  async getProduits({ commit }) {
    const requete = await this.$axios.get('stock/produits')
    const produits = requete.data.produits.map((produit) => {
      return {
        id: produit.id,
        mesure: produit.mesure,
        nom: produit.nom,
        type: produit.type,
      }
    })
    commit('SET_PRODUCTS', produits)
  },
  modifier({ commit }, payload) {
    commit('SET_ONE_PRODUCT', payload)
  },
  videProducts({ commit }) {
    commit('EMPTY_PRODUCTS')
  },
}

export const mutations = {
  EMPTY_PRODUCTS(state) {
    state.produits = []
  },
  SET_PRODUCTS(state, products) {
    state.produits = products
  },
  SET_ONE_PRODUCT(state, product) {
    const index = state.produits.findIndex(
      (element) => element.produit === product.produit
    )
    state.produits.splice(index, 1, product)
  },
}
