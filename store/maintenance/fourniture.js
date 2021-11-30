export const state = () => ({
  fournitures: [],
  fourniture: {},
})
export const getters = {
  fournitures: (state) => {
    return state.fournitures
  },
  fourniture: (state) => {
    return state.fourniture
  },
}
export const actions = {
  async getAll({ commit }) {
    commit('SET_FOURNITURES', [])
    const requete = await this.$axios.get('maintenance/fournitures')
    commit('SET_FOURNITURES', requete.data.fournitures)
  },
  async getTrashed({ commit }) {
    commit('SET_FOURNITURES', [])
    const requete = await this.$axios.get('maintenance/fournitures/trashed/')
    commit('SET_FOURNITURES', requete.data.fournitures)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'maintenance/fournitures/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async getOne({ commit }, id) {
    const requete = await this.$axios.get('maintenance/fournitures/' + id)
    commit('SET_FOURNITURE', requete.data.fourniture)
  },
  async archiver({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'maintenance/fournitures/archiver/' + payload.id
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'maintenance/fournitures/' + payload.id
    )
    dispatch('getTrashed')
    return { message: requete.data.message }
  },
  async restorer({ dispatch }, payload) {
    const requete = await this.$axios.get(
      'maintenance/fournitures/restorer/' + payload.id
    )
    dispatch('getTrashed')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'maintenance/fournitures/new',
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_FOURNITURES(state, fournitures) {
    state.fournitures = fournitures
  },
  SET_fourniture(state, fourniture) {
    state.fourniture = fourniture
  },
}
