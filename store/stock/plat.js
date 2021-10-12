export const state = () => ({
  plats: [],
})
export const getters = {
  plats: (state) => {
    return state.plats
  },
}
export const actions = {
  async getAll({ commit }) {
    const requete = await this.$axios.get('restaurant/plats')
    const plats = requete.data.plats.map((plat) => {
      const imageData = plat.image ? plat.image : []
      const ingredients = plat.produits.map((ingredient) => {
        return {
          id: ingredient.id,
          ingredient: ingredient.nom,
          type: ingredient.type,
          quantite: ingredient.pivot.quantite,
          commentaire: ingredient.commentaire ? ingredient.commentaire : '',
          mesure: ingredient.mesure,
        }
      })
      return {
        id: plat.id,
        code: plat.code,
        nom: plat.nom,
        categorie: plat.categorie,
        categorieNom: plat.categorie_linked.nom,
        description: plat.description,
        image: imageData,
        achat: plat.prix[0].achat,
        vente: plat.prix[0].vente,
        ingredients,
      }
    })
    commit('ALL_PLATS', plats)
  },
  async getPlats({ commit }) {
    const requete = await this.$axios.get('restaurant/plats')
    const plats = requete.data.plats.map((plat) => {
      return {
        ...plat,
        prix_vente: plat.prix[0].vente,
        genre: 'plats',
        valeur: 0,
      }
    })
    commit('ALL_PLATS', plats)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'restaurant/plats/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('restaurant/plats/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post('restaurant/plats/new', payload)
    dispatch('getAll')
    return { message: requete.data.message }
  },
}

export const mutations = {
  ALL_PLATS(state, plats) {
    state.plats.splice(0, state.plats.length)
    state.plats.push(...plats)
  },
}
