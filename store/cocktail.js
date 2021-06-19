export const state = () => ({
  cocktails: [],
  liste: [],
  editListes: [],
})

export const getters = {
  cocktails: (state) => {
    return state.cocktails
  },
  liste: (state) => {
    return state.liste
  },
  editListes: (state) => {
    return state.editListes
  },
}

export const actions = {
  async getAll({ commit }) {
    const requete = await this.$axios.get('bar/cocktails')
    const cocktails = requete.data.cocktails.map((cocktail) => {
      return {
        id: cocktail.id,
        code: cocktail.code,
        nom: cocktail.nom,
        tournees: cocktail.tournees,
        montant: cocktail.prix_list[0].montant,
        description: cocktail.description,
      }
    })
    commit('SET_COCKTAIL', cocktails)
  },
  async trash({ commit }, id) {
    const requete = await this.$axios.delete('bar/cocktails/' + id)
    const { message, cocktail } = requete.data
    this.$notifier.show({ text: message, variant: 'success' })
    commit('DELETE_ONE_COKTAIL', cocktail.id)
  },
  ajouter({ commit }, payload) {
    commit('ADD_COCKTAIL', payload)
  },
  setCocktail({ commit }, payload) {
    commit('SET_COCKTAIL', payload)
  },
  modifier({ commit }, payload) {
    commit('SET_ONE_COCKTAIL', payload)
  },
  supprimer({ commit }, id) {
    commit('DELETE_ONE_COCKTAIL', id)
  },
  viderCocktail({ commit }) {
    commit('EMPTY_COCKTAILS')
  },
  listeAdd({ commit }, payload) {
    commit('ADD', payload)
  },
  listeUpdate({ commit }, payload) {
    commit('SET_ONE', payload)
  },
  setListe({ commit }, payload) {
    commit('SET_LIST', payload)
  },
  listeRemove({ commit }, id) {
    commit('DELETE_ONE', id)
  },
  viderList({ commit }) {
    commit('EMPTY_LIST')
  },
  addEdit({ commit }, payload) {
    commit('ADD_EDIT', payload)
  },
  addEditContent({ commit }, payload) {
    commit('ADD_EDIT_CONTENT', payload)
  },
  removeEditContent({ commit }, payload) {
    commit('REMOVE_EDIT_CONTENT', payload)
  },
  viderEdit({ commit }, id) {
    commit('EMPTY_EDIT', id)
  },
}

export const mutations = {
  ADD_COCKTAIL(state, cocktail) {
    state.cocktails.push(cocktail)
  },
  SET_ONE_COCKTAIL(state, cocktail) {
    const index = state.cocktails.findIndex(
      (element) => element.id === cocktail.id
    )
    state.cocktails.splice(index, 1, cocktail)
  },
  SET_COCKTAIL(state, cocktails) {
    state.cocktails = cocktails
  },

  DELETE_ONE_COCKTAIL(state, id) {
    state.cocktails = state.cocktail.filter((element) => element.id !== id)
  },
  EMPTY_COCKTAIL(state) {
    state.cocktails = []
  },
  ADD(state, line) {
    const index = state.liste.findIndex((element) => element.id === line.id)
    index === -1 ? state.liste.push(line) : state.liste.splice(index, 1, line)
  },
  SET_ONE(state, line) {
    const index = state.liste.findIndex((element) => element.id === line.id)
    state.liste.splice(index, 1, line)
  },
  SET_LIST(state, liste) {
    state.liste = liste
  },
  DELETE_ONE(state, id) {
    state.liste = state.liste.filter((element) => element.id !== id)
  },
  EMPTY_LIST(state) {
    state.liste = []
  },
  ADD_EDIT(state, { id, content }) {
    state.editListes.push({ id, content })
  },
  ADD_EDIT_CONTENT(state, editListe) {
    const { id, content } = editListe
    const editElement = state.editListes.find((element) => element.id === id)
    const index = editElement.content.findIndex(
      (element) => element.id === content.id
    )
    index === -1
      ? editElement.content.push(content)
      : editElement.content.splice(index, 1, content)
  },
  REMOVE_EDIT_CONTENT(state, editListe) {
    const { id, content } = editListe
    const editElement = state.editListes.find((element) => element.id === id)
    const index = editElement.content.findIndex(
      (element) => element.id === content.id
    )
    editElement.content.splice(index, 1)
  },
  EMPTY_EDIT(state, id) {
    const index = state.editListes.findIndex((element) => element.id === id)
    state.editListes.splice(index, 1)
  },
}
