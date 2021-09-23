export const state = () => ({
  roles: [],
})
export const getters = {
  roles: (state) => {
    return state.roles
  },
}
export const actions = {
  async getAll({ commit }) {
    const requete = await this.$axios.get('parametre/roles')
    const roles = requete.data.roles.map((role) => {
      return {
        id: role.id,
        name: role.name,
        guard_name: role.guard_name,
        permissions: role.permissions,
      }
    })
    commit('ALL_ROLES', roles)
  },
  async getRole({ commit }, payload) {
    const requete = await this.$axios.get('parametre/roles/' + payload.id)
    return requete.data.role
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'parametre/roles/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('parametre/roles/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post('parametre/roles/new', payload)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async assigner({ dispatch }, payload) {
    const requete = await this.$axios.post('parametre/roles/assign', payload)
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  ALL_ROLES(state, roles) {
    state.roles = roles
  },
}
