export const state = () => ({
  categories: [],
})
export const getters = {
  categories: (state) => {
    return state.categories
  },
}
export const actions = {
  async getAll({ commit }, id) {
    commit('SET_CATEGORIES', [])
    const requete = await this.$axios.get(
      'externe/parametre/categories/articles/restaurant/' + id
    )
    const categories = requete.data.categories
    commit('SET_CATEGORIES', categories)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'externe/parametre/categories/articles/' + payload.id,
      payload
    )
    dispatch('getAll', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'externe/parametre/categories/articles/' + payload.id
    )
    dispatch('getAll', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'externe/parametre/categories/articles/new',
      payload
    )
    dispatch('getAll', payload.restaurant_id)
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
}
