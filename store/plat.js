export const state = () => ({
  listes: [],
  produits: [],
})

export const getters = {
  produits: (state) => {
    return state.produits
  },
  listes: (state) => {
    return state.listes
  },
}

export const actions = {
  async getProducts({ commit }) {
    const calebasse = await this.$axios.get('restaurant/produits')
    commit('SET_PRODUCTS', calebasse.data.produits)
  },
  ajouter({ commit }, payload) {
    commit('ADD', payload)
  },
  retirer({ commit }, payload) {
    commit('REMOVE', payload)
  },
  videList({ commit }) {
    commit('EMPTY_LIST')
  },
  videProducts({ commit }) {
    commit('EMPTY_PRODUCTS')
  },
}

export const mutations = {
  ADD(state, item) {
    const index = state.listes.findIndex((element) => element.id === item.id)
    if (index !== -1) {
      item.quantite = (
        parseFloat(state.listes[index].quantite) + parseFloat(item.quantite)
      ).toFixed(2)
      state.listes.splice(index, 1, item)
    } else {
      state.listes.push(item)
    }
  },
  REMOVE(state, item) {
    const index = state.listes.findIndex((element) => element.id === item.id)
    state.listes.splice(index, 1)
  },
  SET_PRODUCTS(state, products) {
    state.produits = products
  },
  EMPTY_LIST(state) {
    state.liste = []
  },
  EMPTY_PRODUCTS(state) {
    state.produits = []
  },
}
