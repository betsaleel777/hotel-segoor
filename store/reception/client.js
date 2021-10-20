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
    commit('SET_CLIENTS', [])
    const requete = await this.$axios.get('reception/clients')
    const clients = requete.data.clients.map((client) => {
      const { pieces, ...rest } = client
      return {
        ...rest,
        piece: pieces[0],
        fullname: `${client.nom} ${client.prenom}`,
      }
    })
    commit('SET_CLIENTS', clients)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'reception/clients/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message, id: requete.data.id }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('reception/clients/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post('reception/clients/new', payload)
    dispatch('getAll')
    return { message: requete.data.message, id: requete.data.id }
  },
  async getOne({ commit }, id) {
    const requete = await this.$axios.get('reception/clients/' + id)
    const client = requete.data.client
    const { pieces, ...rest } = client
    return {
      ...rest,
      piece: pieces[0],
      fullname: `${client.nom} ${client.prenom}`,
    }
  },
}

export const mutations = {
  SET_CLIENTS(state, clients) {
    state.clients = clients
  },
}
