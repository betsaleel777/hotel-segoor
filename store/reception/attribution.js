/* eslint-disable camelcase */
// import moment from 'moment'
export const state = () => ({
  attributions: [],
  hebergements: [],
  attribution: {},
})
export const getters = {
  attributions: (state) => {
    return state.attributions
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
        nom: `Chambre ${attribution.chambre_linked.nom} ${attribution.client_linked.nom} ${attribution.client_linked.contact}`,
        prix: attribution.chambre_linked.prix_list[0].montant,
        remise: attribution.remise,
      }
    })
    commit('ALL_ATTRIBUTIONS', attributions)
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
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'reception/attributions/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('reception/attributions/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async liberer({ dispatch }, id) {
    const requete = await this.$axios.put('reception/attributions/free/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  ALL_ATTRIBUTIONS(state, attributions) {
    state.attributions = attributions
  },
  ONE_ATTRIBUTION(state, attribution) {
    state.attribution = attribution
  },
  ALL_HEBERGEMENTS(state, hebergements) {
    state.hebergements = hebergements
  },
}
