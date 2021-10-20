export const state = () => ({
  categories: [],
})
export const getters = {
  categories: (state) => {
    return state.categories
  },
}
export const actions = {
  async getAll({ commit }) {
    commit('SET_CATEGORIES', [])
    const requete = await this.$axios.get('parametre/categories/chambres')
    const categories = requete.data.categories
    commit('SET_CATEGORIES', categories)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'parametre/categories/chambres/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete(
      'parametre/categories/chambres/' + id
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'parametre/categories/chambres/new',
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_CATEGORIES(state, categories) {
    state.categories.splice(0, state.categories.length)
    state.categories.push(...categories)
  },
}
