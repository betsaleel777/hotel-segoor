export const state = () => ({
  cocktails: [],
})
export const getters = {
  cocktails: (state) => {
    return state.cocktails
  },
}
export const actions = {
  async getAll({ commit }) {
    commit('SET_COCKTAILS', [])
    const requete = await this.$axios.get('bar/cocktails')
    const cocktails = requete.data.cocktails
    commit('SET_COCKTAILS', cocktails)
  },
  async getCocktails({ commit }) {
    commit('SET_COCKTAILS', [])
    const requete = await this.$axios.get('bar/cocktails')
    const cocktails = requete.data.cocktails.map((cocktail) => {
      return { ...cocktail, genre: 'cocktails', valeur: 0 }
    })
    commit('SET_COCKTAILS', cocktails)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'bar/cocktails/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('bar/cocktails/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post('bar/cocktails/new', payload)
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_COCKTAILS(state, cocktails) {
    state.cocktails = cocktails
  },
}
