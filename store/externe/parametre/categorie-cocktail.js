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
      'externe/parametre/categories/cocktails/restaurant/' + id
    )
    commit('SET_CATEGORIES', requete.data.categories)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'externe/parametre/categories/cocktails/' + payload.id,
      payload
    )
    dispatch('getAll', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'externe/parametre/categories/cocktails/' + payload.id
    )
    dispatch('getAll', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'externe/parametre/categories/cocktails/new',
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
