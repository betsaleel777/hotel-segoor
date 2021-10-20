export const state = () => ({
  versements: [],
})
export const getters = {
  versements: (state) => {
    return state.versements
  },
}
export const actions = {
  async getAll({ commit }) {
    commit('SET_VERSEMENTS', [])
    const requete = await this.$axios.get('caisses/versements')
    const versements = requete.data.versements
    commit('SET_VERSEMENTS', versements)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'caisses/versements/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('caisses/versements/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post('caisses/versements/new', payload)
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_VERSEMENTS(state, versements) {
    state.versements.splice(0, state.versements.length)
    state.versements.push(...versements)
  },
}
