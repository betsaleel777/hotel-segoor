export const state = () => ({
  produits: [],
})

export const getters = {
  produits: (state) => {
    return state.produits
  },
}

export const actions = {
  async getProducts({ commit }) {
    const calebasse = await this.$axios.get('restaurant/produits')
    commit('SET_PRODUCTS', calebasse.data.produits)
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
}
