import moment from 'moment'
export const state = () => ({
  entretiens: [],
  events: {},
  entretien: {},
})
export const getters = {
  entretiens: (state) => {
    return state.entretiens
  },
  events: (state) => {
    return state.events
  },
  entretien: (state) => {
    return state.entretien
  },
}

const organise = (entretien) => {
  return {
    id: entretien.id,
    name: `${entretien.chambre.nom} ${entretien.employe.nom} ${entretien.employe.prenom}`,
    start: entretien.entree,
    end: entretien.sortie,
    color: entretien.employe.color,
    chambre: entretien.chambre.id,
    employe: entretien.employe.id,
    nomChambre: entretien.chambre.nom,
    fullnameEmploye: `${entretien.employe.nom} ${entretien.employe.prenom}`,
    details: `entretien de la chambre ${entretien.chambre.nom} par l'employée
    ${entretien.employe.nom} ${entretien.employe.prenom} \n du ${moment(
      entretien.entree
    ).format('llll')} au ${moment(entretien.sortie).format('llll')} `,
  }
}
const reformater = (entretiens) => {
  return entretiens.map((entretien) => organise(entretien))
}
export const actions = {
  async getAll({ commit }) {
    commit('SET_ENTRETIENS', [])
    const requete = await this.$axios.get('maintenance/entretiens')
    commit('SET_ENTRETIENS', requete.data.entretiens)
  },
  async getEvents({ commit }) {
    commit('SET_EVENTS', [])
    const requete = await this.$axios.get('maintenance/entretiens')
    commit('SET_EVENTS', reformater(requete.data.entretiens))
  },
  async getTrashed({ commit }) {
    commit('SET_ENTRETIENS', [])
    const requete = await this.$axios.get('maintenance/entretiens/trashed/')
    commit('SET_ENTRETIENS', reformater(requete.data.entretiens))
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'maintenance/entretiens/' + payload.id,
      payload
    )
    dispatch('getEvents')
    return { message: requete.data.message }
  },
  async getOne({ commit }, id) {
    const requete = await this.$axios.get('maintenance/entretiens/' + id)
    commit('SET_ENTRETIEN', requete.data.entretien)
  },
  async archiver({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'maintenance/entretiens/archiver/' + payload.id
    )
    dispatch('getEvents')
    dispatch('getTrashed')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'maintenance/entretiens/' + payload.id
    )
    dispatch('getTrashed')
    return { message: requete.data.message }
  },
  async restorer({ dispatch }, payload) {
    const requete = await this.$axios.get(
      'maintenance/entretiens/restorer/' + payload.id
    )
    dispatch('getTrashed')
    dispatch('getEvents')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'maintenance/entretiens/new',
      payload
    )
    dispatch('getEvents')
    return { message: requete.data.message }
  },
  async getSearchEmployes({ commit }, id) {
    commit('SET_EVENTS', [])
    const requete = await this.$axios.get('maintenance/entretiens')
    let entretiens = reformater(requete.data.entretiens)
    entretiens = entretiens.filter((entretien) => entretien.employe === id)
    const found = entretiens.length
    if (found !== 0) {
      commit('SET_EVENTS', entretiens)
      return { message: `${found} entretien(s) trouvé(s) pour cet employé` }
    } else {
      return { message: 'Aucun entretien trouvé pour cet employé' }
    }
  },
  async getSearchChambres({ commit }, id) {
    commit('SET_EVENTS', [])
    const requete = await this.$axios.get('maintenance/entretiens')
    let entretiens = reformater(requete.data.entretiens)
    entretiens = entretiens.filter((entretien) => entretien.chambre === id)
    const found = entretiens.length
    if (found !== 0) {
      commit('SET_EVENTS', entretiens)
      return {
        message: `${found} entretien(s) trouvé(s) pour cette chambre`,
      }
    } else {
      return { message: 'Aucun entretien trouvé pour cette chambre' }
    }
  },
}

export const mutations = {
  SET_ENTRETIENS(state, entretiens) {
    state.entretiens = entretiens
  },
  SET_EVENTS(state, events) {
    state.events = events
  },
  SET_ENTRETIEN(state, entretien) {
    state.entretien = entretien
  },
}
