import moment from 'moment'
export const state = () => ({
  encaissements: [],
})
export const getters = {
  encaissements: (state) => {
    return state.encaissements
  },
}
export const actions = {
  async getAll({ commit }) {
    const requete = await this.$axios.get('caisses/encaissements')
    const encaissements = requete.data.encaissements
    commit('ALL_ENCAISSEMENT', encaissements)
    return false
  },
  async getEncaissementsDepartement({ commit }, departement) {
    const requete = await this.$axios.get(
      'caisses/encaissements/departement/' + departement
    )
    const encaissements = requete.data.encaissements.map((encaissement) => {
      return {
        id: encaissement.id,
        code: encaissement.code,
        created_at: moment(encaissement.created_at).format('ll'),
        status: encaissement.status,
        attribution_linked: encaissement.attribution,
        produits: encaissement.produits,
        plats: encaissement.plats,
        tournees: encaissement.tournees,
        cocktails: encaissement.cocktails,
        zone: encaissement.zone,
      }
    })
    commit('ALL_ENCAISSEMENT', encaissements)
    return false
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'caisses/encaissements/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('caisses/encaissements/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post('caisses/encaissements/new', payload)
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  ALL_ENCAISSEMENT(state, encaissements) {
    state.encaissements.splice(0, state.encaissements.length)
    state.encaissements.push(...encaissements)
  },
}
