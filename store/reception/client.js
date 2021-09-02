export const state = () => ({
  clients: [],
})
export const getters = {
  clients: (state) => {
    return state.clients
  },
}
export const actions = {
  async getAll({ commit }) {
    const requete = await this.$axios.get('reception/clients')
    const clients = requete.data.clients.map((client) => {
      const { pieces, ...rest } = client
      return {
        ...rest,
        piece: pieces[0],
        fullname: `${client.nom} ${client.prenom}`,
      }
    })
    commit('ALL_CLIENTS', clients)
    return false
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'reception/clients/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('reception/clients/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post('reception/clients/new', payload)
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  ALL_CLIENTS(state, clients) {
    state.clients.splice(0, state.clients.length)
    state.clients.push(...clients)
  },
}
