export const state = () => ({
  restaurants: [],
  restaurant: {},
})
export const getters = {
  restaurants: (state) => {
    return state.restaurants
  },
  restaurant: (state) => {
    return state.restaurant
  },
}
export const actions = {
  async getAll({ commit }) {
    const requete = await this.$axios.get('externe/parametre/restaurants')
    const restaurants = requete.data.restaurants
    commit('ALL_RESTAURANTS', restaurants)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'externe/parametre/restaurants/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete(
      'externe/parametre/restaurants/' + id
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'externe/parametre/restaurants/new',
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async getOne({ commit }, id) {
    const requete = await this.$axios.get('externe/parametre/restaurants/' + id)
    commit('ONE_RESTAURANT', requete.data.restaurant)
  },
}

export const mutations = {
  ALL_RESTAURANTS(state, restaurants) {
    state.restaurants = restaurants
  },
  ONE_RESTAURANT(state, restaurant) {
    state.restaurant = restaurant
  },
}
