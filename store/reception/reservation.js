/* eslint-disable camelcase */
// import moment from 'moment'
export const state = () => ({
  reservations: [],
  hebergements: [],
})
export const getters = {
  reservations: (state) => {
    return state.reservations
  },
  hebergements: (state) => {
    return state.hebergements
  },
}
export const actions = {
  async getAll({ commit }) {
    const requete = await this.$axios.get('reception/reservations')
    const reservations = requete.data.reservations
    commit('ALL_RESERVATIONS', reservations)
  },
  async getReserved({ commit }) {
    const requete = await this.$axios.get('reception/reservations/reserved')
    const reservations = requete.data.reservations
    commit('ALL_RESERVATIONS', reservations)
  },
  async getHebergements({ commit }) {
    const requete = await this.$axios.get('reception/reservations/used')
    const hebergements = requete.data.hebergements
    commit('ALL_HEBERGEMENTS', hebergements)
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'reception/reservations/new',
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'reception/reservations/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('reception/reservations/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async annuler({ dispatch }, id) {
    const requete = await this.$axios.put('reception/reservations/abort/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  ALL_RESERVATIONS(state, reservations) {
    state.reservations = reservations
  },
  ALL_HEBERGEMENTS(state, hebergements) {
    state.hebergements = hebergements
  },
}
