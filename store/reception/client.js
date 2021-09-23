export const state = () => ({
  clients: [],
  client: {},
})
export const getters = {
  clients: (state) => {
    return state.clients
  },
  client: (state) => {
    return state.client
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
    const requete = await this.$axios.get('reception/clients/', id)
    commit('ONE_CLIENT', requete.data.client)
    return requete.data.client
  },
}

export const mutations = {
  ALL_CLIENTS(state, clients) {
    state.clients = clients
  },
  ONE_CLIENT(state, client) {
    state.client = client
  },
}
