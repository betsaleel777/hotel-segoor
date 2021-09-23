export const state = () => ({
  permissions: [],
})
export const getters = {
  permissions: (state) => {
    return state.permissions
  },
}
export const actions = {
  async getAll({ commit }) {
    const requete = await this.$axios.get('parametre/permissions')
    const permissions = requete.data.permissions.map((permission) => {
      return {
        id: permission.id,
        name: permission.name,
        guard_name: permission.guard_name,
      }
    })
    commit('ALL_PERMISSIONS', permissions)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'parametre/permissions/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('parametre/permissions/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post('parametre/permissions/new', payload)
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  ALL_PERMISSIONS(state, permissions) {
    state.permissions.splice(0, state.permissions.length)
    state.permissions.push(...permissions)
  },
}
