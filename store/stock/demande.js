export const state = () => ({
  demandes: [],
})
export const getters = {
  demandes: (state) => {
    return state.demandes
  },
}
export const actions = {
  async getAll({ commit }) {
    commit('SET_DEMANDES', [])
    const requete = await this.$axios.get('stock/demandes')
    commit('SET_DEMANDES', requete.data.demandes)
  },
  async getItem({ commit }, id) {
    const requete = await this.$axios.get('stock/demandes/' + id)
    return requete.data.demande
  },
  async getDemandeBar({ commit }) {
    commit('SET_DEMANDES', [])
    const requete = await this.$axios.get('stock/demandes/bar')
    commit('SET_DEMANDES', requete.data.demandes)
  },
  async getDemandeRestau({ commit }) {
    commit('SET_DEMANDES', [])
    const requete = await this.$axios.get('stock/demandes/restaurant')
    commit('SET_DEMANDES', requete.data.demandes)
  },
  async modifier({ dispatch }, payload) {
    const { departement } = payload
    const requete = await this.$axios.put(
      'stock/demandes/' + payload.id,
      payload
    )
    departement === 1 ? dispatch('getDemandeRestau') : dispatch('getDemandeBar')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('stock/demandes/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const { departement } = payload
    const requete = await this.$axios.post('stock/demandes/new', payload)
    departement === 1 ? dispatch('getDemandeRestau') : dispatch('getDemandeBar')
    return { message: requete.data.message }
  },
  async accept({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'stock/demandes/accept/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async confirm({ dispatch }, payload) {
    const { departement } = payload
    const requete = await this.$axios.put(
      'stock/sorties/confirm/' + payload.id,
      payload
    )
    departement === 1 ? dispatch('getDemandeRestau') : dispatch('getDemandeBar')
    return { message: requete.data.message }
  },
  async reject({ dispatch }, payload) {
    const requete = await this.$axios.get('stock/demandes/reject/' + payload.id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_DEMANDES(state, demandes) {
    state.demandes = demandes
  },
}
