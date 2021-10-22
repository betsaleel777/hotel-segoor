export const state = () => ({
  cocktails: [],
})

export const getters = {
  cocktails: (state) => {
    return state.cocktails
  },
}

export const actions = {
  async getAll({ commit }, id) {
    commit('SET_COCKTAILS', [])
    const requete = await this.$axios.get(
      'externe/stock/cocktails/restaurant/' + id
    )
    const cocktails = requete.data.cocktails.map((cocktail) => {
      const { tournees, ...rest } = cocktail
      const melanges = tournees.map((tournee) => {
        return {
          id: tournee.pivot.tournee_id,
          quantite: tournee.pivot.quantite,
        }
      })
      return { ...rest, melanges }
    })
    commit('SET_COCKTAILS', cocktails)
  },
  async getTrashed({ commit }, id) {
    commit('SET_COCKTAILS', [])
    const requete = await this.$axios.get(
      'externe/stock/cocktails/restaurant/trashed/' + id
    )
    commit('SET_COCKTAILS', requete.data.cocktails)
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'externe/stock/cocktails/new',
      payload
    )
    dispatch('getAll', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'externe/stock/cocktails/' + payload.id,
      payload
    )
    dispatch('getAll', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async archiver({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'externe/stock/cocktails/archiver/' + payload.id
    )
    dispatch('getAll', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async restorer({ dispatch }, payload) {
    const requete = await this.$axios.get(
      'externe/stock/cocktails/restorer/' + payload.id
    )
    dispatch('getTrashed', payload.restaurant_id)
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'externe/stock/cocktails/' + payload.id
    )
    dispatch('getTrashed', payload.restaurant_id)
    return { message: requete.data.message }
  },
}

export const mutations = {
  SET_COCKTAILS(state, cocktails) {
    state.cocktails = cocktails
  },
}
