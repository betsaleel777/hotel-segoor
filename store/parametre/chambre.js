export const state = () => ({
  chambres: [],
  resources: [],
})
export const getters = {
  chambres: (state) => {
    return state.chambres
  },
  resources: (state) => {
    return state.resources
  },
}
export const actions = {
  async getAll({ commit }) {
    const requete = await this.$axios.get('gestion-chambre/chambres')
    const chambres = requete.data.chambres.map((chambre) => {
      const { id, nom, ...reste } = chambre
      return {
        id,
        nom,
        standing: reste.categorie_linked.nom,
        ...reste,
      }
    })
    commit('ALL_CHAMBRES', chambres)
  },
  async getCalendarResources({ commit }) {
    const requete = await this.$axios.get('gestion-chambre/chambres')
    const resources = requete.data.chambres.map((chambre) => {
      const { id, nom } = chambre
      return { id, title: nom.toUpperCase() }
    })
    commit('ALL_RESOURCES', resources)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'gestion-chambre/chambres/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async getOne({ commit }, id) {
    const requete = await this.$axios.get('gestion-chambre/chambres/' + id)
    return requete.data.chambre
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('gestion-chambre/chambres/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'gestion-chambre/chambres/new',
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  ALL_CHAMBRES(state, chambres) {
    state.chambres = chambres
  },
  ALL_RESOURCES(state, resources) {
    state.resources = resources
  },
}
