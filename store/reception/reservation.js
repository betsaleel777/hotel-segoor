import moment from 'moment'
export const state = () => ({
  reservations: [],
  hebergements: [],
  eventsSource: [],
})
export const getters = {
  reservations: (state) => {
    return state.reservations
  },
  hebergements: (state) => {
    return state.hebergements
  },
  eventsSource: (state) => {
    return state.eventsSource
  },
}

const aPayer = function (hebergement) {
  return (
    moment(hebergement.sortie).diff(hebergement.entree, 'days') *
    hebergement.prix
  )
}
const somme = function (versements) {
  let sum = 0
  if (versements) {
    versements.forEach((versement) => {
      sum += versement.montant - versement.monnaie
    })
  }
  return sum
}

export const actions = {
  async getAll({ commit }) {
    const requete = await this.$axios.get('reception/reservations')
    const reservations = requete.data.reservations
    commit('ALL_RESERVATIONS', reservations)
  },
  async getCalendarEvents({ commit }) {
    const requete = await this.$axios.get('reception/reservations/events')
    const events = requete.data.events.map((event) => {
      const colorize = () => {
        if (event.status === 'occupée') {
          return '#E53935'
        } else if (event.status === 'libérée') {
          return '#66BB6A'
        } else if (event.status === 'annulée') {
          return '#FFCA28'
        } else {
          return '#1E88E5'
        }
      }
      return {
        id: event.id,
        resourceId: event.chambre,
        title: `${event.client_linked.nom.toUpperCase()} ${event.client_linked.prenom.toUpperCase()} ${
          event.client_linked.contact
        }`,
        start: moment(event.entree).format('YYYY-MM-DD').toString(),
        end:
          event.status === 'libérée'
            ? moment(event.date_liberation).format('YYYY-MM-DD').toString()
            : moment(event.sortie).format('YYYY-MM-DD').toString(),
        backgroundColor: colorize(),
        eventBorderColor: colorize(),
        // eventTextColor:
        extendedProps: {
          status: event.status,
        },
      }
    })
    const eventsSource = {
      events,
      overlap: false,
      resourceEditable: false,
      startEditable: false,
      editable: true,
    }
    commit('ALL_EVENTS', eventsSource)
  },
  async getReserved({ commit }) {
    const requete = await this.$axios.get('reception/reservations/reserved')
    const reservations = requete.data.reservations.map((reservation) => {
      return {
        ...reservation,
        montant: aPayer(reservation),
        verse: somme(reservation?.encaissement?.versements),
      }
    })
    commit('ALL_RESERVATIONS', reservations)
  },
  async getHebergements({ commit }) {
    const requete = await this.$axios.get('reception/reservations/used')
    const hebergements = requete.data.hebergements
    commit('ALL_HEBERGEMENTS', hebergements)
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'reception/reservations/new',
      payload
    )
    dispatch('getReserved')
    return { message: requete.data.message }
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'reception/reservations/' + payload.id,
      payload
    )
    dispatch('getReserved')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('reception/reservations/' + id)
    dispatch('getReserved')
    return { message: requete.data.message }
  },
  async annuler({ dispatch }, id) {
    const requete = await this.$axios.put('reception/reservations/abort/' + id)
    dispatch('getReserved')
    return { message: requete.data.message }
  },
}

export const mutations = {
  ALL_RESERVATIONS(state, reservations) {
    state.reservations = reservations
  },
  ALL_HEBERGEMENTS(state, hebergements) {
    state.hebergements = hebergements
  },
  ALL_EVENTS(state, eventsSource) {
    state.eventsSource = eventsSource
  },
}
