export const state = () => ({
  moyens: [],
})
export const getters = {
  moyens: (state) => {
    return state.moyens
  },
}
export const actions = {
  async getAll({ commit }) {
    commit('SET_MOYENS', [])
    const requete = await this.$axios.get('caisses/mobilesMoney')
    const moyens = requete.data.mobiles
    commit('SET_MOYENS', moyens)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'caisses/mobilesMoney/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('caisses/mobilesMoney/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post('caisses/mobilesMoney/new', payload)
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_MOYENS(state, moyens) {
    state.moyens = moyens
  },
}
