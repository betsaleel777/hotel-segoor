export const state = () => ({
  chambres: [],
})
export const getters = {
  chambres: (state) => {
    return state.chambres
  },
}
export const actions = {
  async getAll({ commit }) {
    const requete = await this.$axios.get('gestion-chambre/chambres')
    const chambres = requete.data.chambres
    commit('ALL_CHAMBRES', chambres)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'gestion-chambre/chambres/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('gestion-chambre/chambres/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'gestion-chambre/chambres/new',
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  ALL_CHAMBRES(state, chambres) {
    state.chambres.splice(0, state.chambres.length)
    state.chambres.push(...chambres)
  },
}
