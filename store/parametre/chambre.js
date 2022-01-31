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
    commit('SET_CHAMBRES', [])
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
    commit('SET_CHAMBRES', chambres)
  },
  async getCalendarResources({ commit }) {
    commit('SET_RESOURCES', [])
    const requete = await this.$axios.get('gestion-chambre/chambres')
    const resources = requete.data.chambres.map((chambre) => {
      const { id, nom } = chambre
      return { id, title: nom.toUpperCase() }
    })
    commit('SET_RESOURCES', resources)
  },
  async getChambresByCategorie({ commit }, categorie) {
    const requete = await this.$axios.get(
      'gestion-chambre/chambres/categorie/' + categorie
    )
    return requete.data.chambres.map(({ nom, id, prixVente }) => {
      return { id, nom, prixVente }
    })
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
  async setState({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'gestion-chambre/chambres/equipement/new',
      payload
    )
    return { message: requete.data.message }
  },
  async editState({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'gestion-chambre/chambres/equipement/' + payload.id,
      payload
    )
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_CHAMBRES(state, chambres) {
    state.chambres = chambres
  },
  SET_RESOURCES(state, resources) {
    state.resources = resources
  },
}
