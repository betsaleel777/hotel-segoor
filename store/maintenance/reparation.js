import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)
export const state = () => ({
  reparations: [],
  events: {},
  reparation: {},
  repairs: {},
  incompletes: [],
})
export const getters = {
  reparations: (state) => {
    return state.reparations
  },
  events: (state) => {
    return state.events
  },
  reparation: (state) => {
    return state.reparation
  },
  repairs: (state) => {
    return state.repairs
  },
  incompletes: (state) => {
    return state.incompletes
  },
}
const colorize = (event) => {
  if (moment().isBefore(event.entree, 'days')) {
    return 'info'
  } else if (moment().isSame(event.sortie, 'days')) {
    return 'primary darken-4'
  } else if (event.status === 'complete') {
    return 'success'
  } else if (event.status === 'incomplete') {
    return 'warning'
  } else {
    return 'error'
  }
}
const montant = (ordres) => {
  let somme = 0
  ordres.forEach((ordre) => (somme += ordre.montant))
  return somme
}
const organize = (reparation) => {
  const { id, nom, chambre, categorie, ordres, ...rest } = reparation
  return {
    id,
    nom,
    ordres,
    chambre: chambre.id,
    categorie: categorie.id,
    montant: montant(ordres),
    nomChambre: chambre.nom,
    nomCategorie: categorie.nom,
    ...rest,
  }
}
const organise = (ordre) => {
  return {
    id: ordre.id,
    status: ordre.status,
    rstatus: ordre.reparation.status,
    reparation: ordre.reparation.id,
    name: `${ordre.reparation.nom}-${ordre.code}`,
    nom: ordre.reparation.nom,
    start: ordre.entree.substring(0, 19),
    end: ordre.sortie.substring(0, 19),
    color: colorize(ordre),
    chambre: ordre.reparation.chambre.id,
    categorie: ordre.reparation.categorie_id,
    nomCategorie: ordre.reparation.categorie.nom,
    fermeture: ordre.fermeture,
    montant: ordre.montant,
    provider: ordre.provider.id,
    description: ordre.description,
    nomChambre: ordre.reparation.chambre.nom,
    fullnameProvider: `${ordre.provider.nom} ${ordre.provider.prenom}`,
    details: `réparation de la chambre ${
      ordre.reparation.chambre.nom
    } par le fournisseur
    ${ordre.provider.nom} ${ordre.provider.prenom} du ${moment(
      ordre.entree
    ).format('llll')} au ${moment(ordre.sortie).format('llll')} `,
  }
}
const reformater = (reparations) => {
  return reparations.map((reparation) => organise(reparation))
}
const reformat = (reparations) => {
  return reparations.map((reparation) => organize(reparation))
}
export const actions = {
  async getAll({ commit }) {
    commit('SET_REPAIRS', [])
    const requete = await this.$axios.get('maintenance/reparations')
    commit('SET_REPAIRS', reformat(requete.data.reparations))
  },
  async getByDate({ commit }, time) {
    commit('SET_REPAIRS', [])
    const requete = await this.$axios.get(
      'maintenance/reparations/date/' + time[0]
    )
    commit('SET_REPAIRS', reformat(requete.data.reparations))
  },
  async getByDates({ commit }, times) {
    commit('SET_REPAIRS', [])
    const requete = await this.$axios.get('maintenance/reparations')
    const range = moment.range(times)
    const reparations = requete.data.reparations.filter((reparation) =>
      range.contains(moment(reparation.created_at))
    )
    commit('SET_REPAIRS', reformat(reparations))
  },
  async getEvents({ commit }) {
    commit('SET_EVENTS', [])
    const requete = await this.$axios.get('maintenance/reparations/ordres')
    commit('SET_EVENTS', reformater(requete.data.ordres))
  },
  async getTrashed({ commit }) {
    commit('SET_REPARATIONS', [])
    const requete = await this.$axios.get('maintenance/reparations/trashed/')
    commit('SET_REPARATIONS', reformater(requete.data.reparations))
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'maintenance/reparations/' + payload.id,
      payload
    )
    dispatch('getEvents')
    dispatch('getIncompletes')
    return { message: requete.data.message }
  },
  async getOne({ commit }, id) {
    const requete = await this.$axios.get('maintenance/reparations/' + id)
    commit('SET_REPARATION', requete.data.reparation)
  },
  async getIncompletes({ commit }) {
    const requete = await this.$axios.get(
      'maintenance/reparations/ordres/incompletes'
    )
    const ordres = requete.data.ordres.filter(
      (ordre) => ordre.reparation !== null
    )
    commit('SET_INCOMPLETES', reformater(ordres))
  },
  async fetchOne({ commit }, id) {
    const requete = await this.$axios.get('maintenance/reparations/' + id)
    const { ordres } = requete.data.reparation
    const total = montant(ordres)
    const reparation = { montant: total, ...requete.data.reparation }
    return reparation
  },
  async archiver({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'maintenance/reparations/archiver/' + payload.id
    )
    dispatch('getEvents')
    dispatch('getTrashed')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, payload) {
    const requete = await this.$axios.delete(
      'maintenance/reparations/' + payload.id
    )
    dispatch('getTrashed')
    dispatch('getIncompletes')
    return { message: requete.data.message }
  },
  async restorer({ dispatch }, payload) {
    const requete = await this.$axios.get(
      'maintenance/reparations/restorer/' + payload.id
    )
    dispatch('getTrashed')
    dispatch('getEvents')
    dispatch('getIncompletes')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'maintenance/reparations/new',
      payload
    )
    dispatch('getEvents')
    return { message: requete.data.message }
  },
  async getSearchProviders({ commit }, id) {
    commit('SET_EVENTS', [])
    const requete = await this.$axios.get('maintenance/reparations/ordres')
    let reparations = reformater(requete.data.ordres)
    reparations = reparations.filter((reparation) => reparation.provider === id)
    const found = reparations.length
    if (found !== 0) {
      commit('SET_EVENTS', reparations)
      return { message: `${found} reparation(s) trouvé(s) pour ce fournisseur` }
    } else {
      return { message: 'Aucun reparation trouvé pour ce fournisseur' }
    }
  },
  async getSearchChambres({ commit }, id) {
    commit('SET_EVENTS', [])
    const requete = await this.$axios.get('maintenance/reparations/ordres')
    let reparations = reformater(requete.data.ordres)
    reparations = reparations.filter((reparation) => reparation.chambre === id)
    const found = reparations.length
    if (found !== 0) {
      commit('SET_EVENTS', reparations)
      return {
        message: `${found} reparation(s) trouvé(s) pour cette chambre`,
      }
    } else {
      return { message: 'Aucun reparation trouvé pour cette chambre' }
    }
  },
  async getByRoom({ commit }, id) {
    commit('SET_REPARATIONS', [])
    const requete = await this.$axios.get('maintenance/reparations/room/' + id)
    commit('SET_REPARATIONS', requete.data.ordres)
  },
}

export const mutations = {
  SET_REPARATIONS(state, reparations) {
    state.reparations = reparations
  },
  SET_INCOMPLETES(state, incompletes) {
    state.incompletes = incompletes
  },
  SET_REPAIRS(state, repairs) {
    state.repairs = repairs
  },
  SET_EVENTS(state, events) {
    state.events = events
  },
  SET_REPARATION(state, reparation) {
    state.reparation = reparation
  },
}
