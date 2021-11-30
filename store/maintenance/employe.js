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
    const employes = requete.data.employes.map((employe) => {
      return { ...employe, fullname: `${employe.nom} ${employe.prenom}` }
    })
    commit('SET_EMPLOYES', employes)
  },
  async getTrashed({ commit }) {
    commit('SET_EMPLOYES', [])
    const requete = await this.$axios.get('maintenance/employes/trashed/')
    const employes = requete.data.employes.map((employe) => {
      return { ...employe, fullname: `${employe.nom} ${employe.prenom}` }
    })
    commit('SET_EMPLOYES', employes)
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
  async archiver({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'maintenance/employes/archiver/' + payload.id
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'maintenance/employes/' + payload.id
    )
    dispatch('getTrashed')
    return { message: requete.data.message }
  },
  async restorer({ dispatch }, payload) {
    const requete = await this.$axios.get(
      'maintenance/employes/restorer/' + payload.id
    )
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
