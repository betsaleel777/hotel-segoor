/* eslint-disable camelcase */
export const state = () => ({
  factures: [],
})
export const getters = {
  factures: (state) => {
    return state.factures
  },
}
export const actions = {
  async getAll({ commit }) {
    const requete = await this.$axios.get('reception/encaissements')
    const factures = requete.data.encaissements.map((facture) => {
      const {
        attribution_linked,
        reservation_linked,
        versements,
        ...rest
      } = facture
      let object = {}
      if (Object.keys(attribution_linked).length > 0) {
        object = {
          ...rest,
          chambre: attribution_linked.chambre_linked.nom,
          client:
            attribution_linked.client_linked.nom +
            ' ' +
            attribution_linked.client_linked.prenom,
          versements,
          attribution: attribution_linked,
        }
      } else if (Object.keys(reservation_linked).length > 0) {
        object = {
          ...rest,
          chambre: reservation_linked.chambre_linked.nom,
          client:
            reservation_linked.client_linked.nom +
            ' ' +
            reservation_linked.client_linked.prenom,
          versements,
          reservation: reservation_linked,
        }
      }
      return object
    })
    commit('ALL_FACTURES', factures)
    return false
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'reception/encaissements/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('reception/encaissements/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'reception/encaissements/new',
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  ALL_FACTURES(state, factures) {
    state.factures.splice(0, state.factures.length)
    state.factures.push(...factures)
  },
}
