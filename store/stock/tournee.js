/* eslint-disable camelcase */
export const state = () => ({
  tournees: [],
})
export const getters = {
  tournees: (state) => {
    return state.tournees
  },
}
export const actions = {
  async getAll({ commit }) {
    commit('SET_TOURNEES', [])
    const requete = await this.$axios.get('bar/tournees')
    const tournees = requete.data.tournees.map((tournee) => {
      return {
        ...tournee,
        produit: tournee.produit_linked.id,
        montant: tournee.prix_list[0].montant,
      }
    })
    commit('SET_TOURNEES', tournees)
  },
  async getTourneesCaisse({ commit }) {
    commit('SET_TOURNEES', [])
    const requete = await this.$axios.get('bar/tournees')
    const tournees = requete.data.tournees.map((tournee) => {
      return { ...tournee, nom: tournee.titre, genre: 'tournees', valeur: 0 }
    })
    commit('SET_TOURNEES', tournees)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put('bar/tournees/' + payload.id, payload)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('bar/tournees/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post('bar/tournees/new', payload)
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_TOURNEES(state, tournees) {
    state.tournees = tournees
  },
}
