export const state = () => ({
  achats: [],
  achatsDatesCompactees: [],
})

export const getters = {
  achats: (state) => {
    return state.achats
  },
  achatsDatesCompactees: (state) => {
    return state.achatsDatesCompactees
  },
}

export const actions = {
  async getAll({ commit }) {
    commit('SET_ACHATS', [])
    const requete = await this.$axios.get('stock/achats/')
    commit('SET_ACHATS', requete.data.achats)
  },
  async getByDate({ commit }, payload) {
    commit('SET_ACHATS', [])
    const requete = await this.$axios.get(`stock/achats/date/${payload.jour}`)
    commit('SET_ACHATS', requete.data.achats)
  },
  async getCompactees({ commit }) {
    commit('SET_COMPACTES', [])
    const requete = await this.$axios.get('stock/achats/compacte')
    commit('SET_COMPACTES', requete.data.achats)
  },
  async getItem({ commit }, id) {
    const requete = await this.$axios.get('stock/achats/' + id)
    return requete.data.depense
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post('stock/achats/new', payload)
    dispatch('getCompactees')
    return { message: requete.data.message }
  },
  // async supprimer({ dispatch }, payload) {
  //   const requete = await this.$axios.delete('stock/achats/' + payload.id)
  //   dispatch('getTrashed', payload.restaurant_id)
  //   return { message: requete.data.message }
  // },
}

export const mutations = {
  SET_ACHATS(state, achats) {
    state.achats = achats
  },
  SET_COMPACTES(state, achatsDatesCompactees) {
    state.achatsDatesCompactees = achatsDatesCompactees
  },
}
