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
  async getAll({ commit }) {
    commit('SET_CATEGORIES', [])
    const requete = await this.$axios.get('parametre/categories/maintenance')
    const categories = requete.data.categories
    commit('SET_CATEGORIES', categories)
  },
  async getTrashed({ commit }) {
    commit('SET_ARCHIVES', [])
    const requete = await this.$axios.get(
      'parametre/categories/maintenance/trashed/'
    )
    commit('SET_ARCHIVES', requete.data.categories)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'parametre/categories/maintenance/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'parametre/categories/maintenance/' + payload.id
    )
    dispatch('getTrashed')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'parametre/categories/maintenance/new',
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async restorer({ dispatch }, payload) {
    const requete = await this.$axios.get(
      'parametre/categories/maintenance/restorer/' + payload.id
    )
    dispatch('getTrashed')
    return { message: requete.data.message }
  },
  async archiver({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'parametre/categories/maintenance/archiver/' + payload.id
    )
    dispatch('getAll')
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
