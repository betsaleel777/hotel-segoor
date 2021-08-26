/* eslint-disable camelcase */
import moment from 'moment'
export const state = () => ({
  attributions: [],
})
export const getters = {
  attributions: (state) => {
    return state.attributions
  },
}
export const actions = {
  async getAll({ commit }) {
    const requete = await this.$axios.get('reception/attributions')
    const attributions = requete.data.attributions.map((attribution) => {
      const { chambre_linked, client_linked, ...rest } = attribution
      return {
        id: rest.id,
        code: rest.code,
        status: rest.status,
        chambre: { id: chambre_linked.id, nom: chambre_linked.nom },
        client: { id: client_linked.id, nom: client_linked.nom },
        entree: moment(rest.entree).format('ll'),
        sortie: moment(rest.sortie).format('ll'),
      }
    })
    commit('ALL_ATTRIBUTIONS', attributions)
  },
  async edit({ commit }, payload) {
    const requete = await this.$axios.put(
      'reception/attributions/' + payload.id,
      payload
    )
    this.getAll({ commit })
    this.$notifier.show({ text: requete.data.message, variant: 'success' })
  },
  async delete({ commit }, id) {
    const requete = await this.$axios.delete('reception/attributions/' + id)
    this.getAll({ commit })
    this.$notifier.show({ text: requete.data.message, variant: 'success' })
  },
}

export const mutations = {
  ALL_ATTRIBUTIONS(state, attributions) {
    state.attributions.push(attributions)
  },
}
