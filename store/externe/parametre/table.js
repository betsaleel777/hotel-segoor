export const state = () => ({
  tables: [],
  archives: [],
})

export const getters = {
  tables: (state) => {
    return state.tables
  },
  archives: (state) => {
    return state.archives
  },
}

export const actions = {
  async getAll({ commit }, payload) {
    commit('SET_TABLES', [])
    const requete = await this.$axios.get(
      'externe/parametre/tables/restaurant/' + payload.restaurant_id
    )
    commit('SET_TABLES', requete.data.tables)
  },
  async getTrashed({ commit }, payload) {
    commit('SET_ARCHIVES', [])
    const requete = await this.$axios.get(
      'externe/parametre/tables/restaurant/trashed/' + payload.restaurant_id
    )
    commit('SET_ARCHIVES', requete.data.tables)
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'externe/parametre/tables/new',
      payload
    )
    dispatch('getAll', payload)
    return { message: requete.data.message }
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'externe/parametre/tables/' + payload.id,
      payload
    )
    dispatch('getAll', payload)
    return { message: requete.data.message }
  },
  async archiver({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'externe/parametre/tables/archiver/' + payload.id
    )
    dispatch('getAll', payload)
    return { message: requete.data.message }
  },
  async restorer({ dispatch }, payload) {
    const requete = await this.$axios.get(
      'externe/parametre/tables/restorer/' + payload.id
    )
    dispatch('getTrashed', payload)
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'externe/parametre/tables/' + payload.id
    )
    dispatch('getTrashed', payload)
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_TABLES(state, tables) {
    state.tables = tables
  },
  SET_ARCHIVES(state, archives) {
    state.archives = archives
  },
}
