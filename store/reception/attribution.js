/* eslint-disable camelcase */
// import moment from 'moment'
export const state = () => ({
  attributions: [],
  hebergements: [],
  attributionsEnCours: [],
  attribution: {},
})
export const getters = {
  attributions: (state) => {
    return state.attributions
  },
  attributionsEnCours: (state) => {
    return state.attributionsEnCours
  },
  attribution: (state) => {
    return state.attribution
  },
  hebergements: (state) => {
    return state.hebergements
  },
}
export const actions = {
  async getAll({ commit }) {
    const requete = await this.$axios.get('reception/attributions')
    const attributions = requete.data.attributions
    commit('ALL_ATTRIBUTIONS', attributions)
  },
  async getBusy({ commit }) {
    const requete = await this.$axios.get('reception/attributions/busy')
    const attributions = requete.data.attributions
    commit('ALL_ATTRIBUTIONS', attributions)
  },
  async getHebergements({ commit }) {
    const requete = await this.$axios.get('reception/attributions/used')
    const hebergements = requete.data.hebergements
    commit('ALL_HEBERGEMENTS', hebergements)
  },
  async getEnCours({ commit }) {
    const requete = await this.$axios.get('reception/attributions/busy')
    const filtrees = requete.data.attributions.filter(
      (attribution) => attribution.status === 'occupée'
    )
    const attributions = filtrees.map((attribution) => {
      return {
        id: attribution.id,
        nom: `Chambre ${attribution.chambre_linked.nom} ${attribution.client_linked.nom} ${attribution.client_linked.prenom}`,
        prix: attribution.prix,
        remise: attribution.remise,
      }
    })
    commit('ATTRIBUTIONS_EN_COURS', attributions)
  },
  async getUniq({ commit }, id) {
    const requete = await this.$axios.get('reception/attributions/' + id)
    const attribution = requete.data.attribution
    commit('ONE_ATTRIBUTION', attribution)
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'reception/attributions/new',
      payload
    )
    dispatch('getBusy')
    return { message: requete.data.message }
  },
  async attribuer({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'reception/attributions/new',
      payload
    )
    dispatch('getBusy')
    return { message: requete.data.message }
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'reception/attributions/' + payload.id,
      payload
    )
    dispatch('getBusy')
    return { message: requete.data.message }
  },
  async modifierCalendrier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'reception/attributions/event/' + payload.id,
      payload
    )
    dispatch('getBusy')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('reception/attributions/' + id)
    dispatch('getBusy')
    return { message: requete.data.message }
  },
  async liberer({ dispatch }, id) {
    const requete = await this.$axios.put('reception/attributions/free/' + id)
    dispatch('getBusy')
    return { message: requete.data.message }
  },
}

export const mutations = {
  ALL_ATTRIBUTIONS(state, attributions) {
    state.attributions = attributions
  },
  ATTRIBUTIONS_EN_COURS(state, attributions) {
    state.attributionsEnCours = attributions
  },
  ONE_ATTRIBUTION(state, attribution) {
    state.attribution = attribution
  },
  ALL_HEBERGEMENTS(state, hebergements) {
    state.hebergements = hebergements
  },
}
