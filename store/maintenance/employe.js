export const state = () => ({
  employes: [],
  employe: {},
})
export const getters = {
  employes: (state) => {
    return state.employes
  },
  employe: (state) => {
    return state.employe
  },
}
export const actions = {
  async getAll({ commit }) {
    commit('SET_EMPLOYES', [])
    const requete = await this.$axios.get('maintenance/employes')
    commit('SET_EMPLOYES', requete.data.employes)
  },
  async getTrashed({ commit }) {
    commit('SET_EMPLOYES', [])
    const requete = await this.$axios.get('maintenance/employes/trashed/')
    commit('SET_EMPLOYES', requete.data.employes)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'maintenance/employes/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async getOne({ commit }, id) {
    const requete = await this.$axios.get('maintenance/employes/' + id)
    commit('SET_EMPLOYE', requete.data.employe)
  },
  async archiver({ dispatch }, id) {
    const requete = await this.$axios.delete('maintenance/archiver/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('maintenance/employes/' + id)
    dispatch('getTrashed')
    return { message: requete.data.message }
  },
  async restorer({ dispatch }, id) {
    const requete = await this.$axios.get('maintenance/restorer/' + id)
    dispatch('getTrashed')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post('maintenance/employes/new', payload)
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_EMPLOYES(state, employes) {
    state.employes = employes
  },
  SET_EMPLOYE(state, employe) {
    state.employe = employe
  },
}
