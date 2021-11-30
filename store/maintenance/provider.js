export const state = () => ({
  providers: [],
  provider: {},
})
export const getters = {
  providers: (state) => {
    return state.providers
  },
  provider: (state) => {
    return state.provider
  },
}
export const actions = {
  async getAll({ commit }) {
    commit('SET_PROVIDERS', [])
    const requete = await this.$axios.get('maintenance/providers')
    commit('SET_PROVIDERS', requete.data.providers)
  },
  async getTrashed({ commit }) {
    commit('SET_PROVIDERS', [])
    const requete = await this.$axios.get('maintenance/providers/trashed/')
    commit('SET_PROVIDERS', requete.data.providers)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'maintenance/providers/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async getOne({ commit }, id) {
    const requete = await this.$axios.get('maintenance/providers/' + id)
    commit('SET_PROVIDER', requete.data.provider)
  },
  async archiver({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'maintenance/providers/archiver/' + payload.id
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'maintenance/providers/' + payload.id
    )
    dispatch('getTrashed')
    return { message: requete.data.message }
  },
  async restorer({ dispatch }, payload) {
    const requete = await this.$axios.get(
      'maintenance/providers/restorer/' + payload.id
    )
    dispatch('getTrashed')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post('maintenance/providers/new', payload)
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_PROVIDERS(state, providers) {
    state.providers = providers
  },
  SET_PROVIDER(state, provider) {
    state.provider = provider
  },
}
