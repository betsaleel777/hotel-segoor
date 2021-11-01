export const state = () => ({
  categories: [],
  archives: [],
})
export const getters = {
  categories: (state) => {
    return state.categories
  },
  archives: (state) => {
    return state.archives
  },
}
export const actions = {
  async getAll({ commit }, payload) {
    commit('SET_CATEGORIES', [])
    const requete = await this.$axios.get(
      'externe/parametre/categories/cocktails/restaurant/' +
        payload.restaurant_id
    )
    commit('SET_CATEGORIES', requete.data.categories)
  },
  async getTrashed({ commit }, payload) {
    commit('SET_ARCHIVES', [])
    const requete = await this.$axios.get(
      'externe/parametre/categories/cocktails/restaurant/trashed/' +
        payload.restaurant_id
    )
    commit('SET_ARCHIVES', requete.data.categories)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'externe/parametre/categories/cocktails/' + payload.id,
      payload
    )
    dispatch('getAll', payload)
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'externe/parametre/categories/cocktails/' + payload.id
    )
    dispatch('getTrashed', payload)
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'externe/parametre/categories/cocktails/new',
      payload
    )
    dispatch('getAll', payload)
    return { message: requete.data.message }
  },
  async restorer({ dispatch }, payload) {
    const requete = await this.$axios.get(
      'externe/parametre/categories/cocktails/restorer/' + payload.id
    )
    dispatch('getTrashed', payload)
    return { message: requete.data.message }
  },
  async archiver({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'externe/parametre/categories/cocktails/archiver/' + payload.id
    )
    dispatch('getAll', payload)
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  SET_ARCHIVES(state, archives) {
    state.archives = archives
  },
}
