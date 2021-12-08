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
    const requete = await this.$axios.get('parametre/categories/articles')
    const categories = requete.data.categories
    commit('SET_CATEGORIES', categories)
  },
  async getTrashed({ commit }) {
    commit('SET_ARCHIVES', [])
    const requete = await this.$axios.get(
      'parametre/categories/reparations/trashed/'
    )
    commit('SET_ARCHIVES', requete.data.categories)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'parametre/categories/articles/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'parametre/categories/articles/' + payload.id
    )
    dispatch('getTrashed')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'parametre/categories/articles/new',
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message, id: requete.data.id }
  },
  async restorer({ dispatch }, payload) {
    const requete = await this.$axios.get(
      'parametre/categories/chambres/restorer/' + payload.id
    )
    dispatch('getTrashed')
    return { message: requete.data.message }
  },
  async archiver({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'parametre/categories/chambres/archiver/' + payload.id
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
