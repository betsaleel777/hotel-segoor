export const state = () => ({
  moyens: [],
  archives: [],
})
export const getters = {
  moyens: (state) => {
    return state.moyens
  },
  archives: (state) => {
    return state.archives
  },
}
export const actions = {
  async getAll({ commit }, payload) {
    commit('SET_MOYENS', [])
    const requete = await this.$axios.get(
      'externe/parametre/mobiles/restaurant/' + payload.restaurant_id
    )
    commit('SET_MOYENS', requete.data.moyens)
  },
  async getTrashed({ commit }, payload) {
    commit('SET_ARCHIVES', [])
    const requete = await this.$axios.get(
      'externe/parametre/mobiles/restaurant/trashed/' + payload.restaurant_id
    )
    commit('SET_ARCHIVES', requete.data.moyens)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'externe/parametre/mobiles/' + payload.id,
      payload
    )
    dispatch('getAll', payload)
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'externe/parametre/mobiles/' + payload.id
    )
    dispatch('getTrashed', payload)
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'externe/parametre/mobiles/new',
      payload
    )
    dispatch('getAll', payload)
    return { message: requete.data.message }
  },
  async restorer({ dispatch }, payload) {
    const requete = await this.$axios.get(
      'externe/parametre/mobiles/restorer/' + payload.id
    )
    dispatch('getTrashed', payload)
    return { message: requete.data.message }
  },
  async archiver({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'externe/parametre/mobiles/archiver/' + payload.id
    )
    dispatch('getAll', payload)
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_MOYENS(state, moyens) {
    state.moyens = moyens
  },
  SET_ARCHIVES(state, archives) {
    state.archives = archives
  },
}
