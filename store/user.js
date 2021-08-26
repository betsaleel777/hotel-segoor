export const state = () => ({
  users: [],
})
export const getters = {
  users: (state) => {
    return state.users
  },
}
export const actions = {
  async getAll({ commit }) {
    const requete = await this.$axios.get('parametre/users')
    const users = requete.data.users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        roles: user.roles,
      }
    })
    commit('ALL_USERS', users)
    return false
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'parametre/users/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('parametre/users/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post('parametre/users/new', payload)
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  ALL_USERS(state, users) {
    state.users.splice(0, state.users.length)
    state.users.push(...users)
  },
}
