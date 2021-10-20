export const state = () => ({
  tournees: [],
})

export const getters = {
  tournees: (state) => {
    return state.tournees
  },
}

export const actions = {
  async getAll({ commit }, id) {
    const requete = await this.$axios.get(
      'externe/stock/tournees/restaurant/' + id
    )
    commit('SET_TOURNEES', requete.data.tournees)
  },
  async getTrashed({ commit }, id) {
    const requete = await this.$axios.get(
      'externe/stock/tournees/restaurant/trashed/' + id
    )
    commit('SET_TOURNEES', requete.data.tournees)
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'externe/stock/tournees/new',
      payload
    )
    dispatch('getAll', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'externe/stock/tournees/' + payload.id,
      payload
    )
    dispatch('getAll', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async archiver({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'externe/stock/tournees/archiver/' + payload.id
    )
    dispatch('getAll', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'externe/stock/tournees/' + payload.id
    )
    dispatch('getTrashed', payload.restaurant_id)
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_TOURNEES(state, tournees) {
    state.tournees = tournees
  },
}
