export const state = () => ({
  encaissements: [],
})
export const getters = {
  encaissements: (state) => {
    return state.encaissements
  },
}
export const actions = {
  async getAll({ commit }) {
    const requete = await this.$axios.get('reception/encaissements/new')
    const encaissements = requete.data.encaissements
    commit('ALL_ENCAISSEMENTS', encaissements)
    return false
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'reception/encaissements/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('reception/encaissements/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'reception/encaissements/new',
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  ALL_ENCAISSEMENTS(state, encaissements) {
    state.encaissements = encaissements
  },
}
