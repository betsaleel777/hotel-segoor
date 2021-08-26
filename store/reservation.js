/* eslint-disable camelcase */
import moment from 'moment'
export const state = () => ({
  reservations: [],
})
export const getters = {
  reservations: (state) => {
    return state.reservations
  },
}
export const actions = {
  async getAll({ commit }) {
    const requete = await this.$axios.get('reception/reservations')
    const reservations = requete.data.reservations.map((reservation) => {
      const { chambre_linked, client_linked, ...rest } = reservation
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
    commit('ALL_RESERVATIONS', reservations)
  },
  async edit({ commit }, payload) {
    const requete = await this.$axios.put(
      'reception/reservations/' + payload.id,
      payload
    )
    this.getAll({ commit })
    this.$notifier.show({ text: requete.data.message, variant: 'success' })
  },
  async delete({ commit }, id) {
    const requete = await this.$axios.delete('reception/reservations/' + id)
    this.getAll({ commit })
    this.$notifier.show({ text: requete.data.message, variant: 'success' })
  },
}

export const mutations = {
  ALL_RESERVATIONS(state, reservations) {
    state.reservations.push(reservations)
  },
}
