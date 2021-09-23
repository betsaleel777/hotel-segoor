/* eslint-disable camelcase */
import moment from 'moment'
export const state = () => ({
  factures: [],
})
export const getters = {
  factures: (state) => {
    return state.factures
  },
}
const somme = function (versements) {
  let sum = 0
  versements.forEach((versement) => {
    sum += versement.montant - versement.monnaie
  })
  return sum
}
const organiser = function (facture) {
  const {
    attribution_linked,
    reservation_linked,
    versements,
    created_at,
    ...rest
  } = facture
  let object = {}
  if (Object.keys(attribution_linked).length > 0) {
    object = {
      ...rest,
      chambre: attribution_linked.chambre_linked.nom,
      client:
        attribution_linked.client_linked.nom +
        ' ' +
        attribution_linked.client_linked.prenom,
      versements,
      attribution: attribution_linked,
      created_at: moment(created_at).format('DD-MM-YYYY'),
      montant: somme(versements),
    }
  } else if (Object.keys(reservation_linked).length > 0) {
    object = {
      ...rest,
      chambre: reservation_linked.chambre_linked.nom,
      client:
        reservation_linked.client_linked.nom +
        ' ' +
        reservation_linked.client_linked.prenom,
      versements,
      reservation: reservation_linked,
      created_at: moment(created_at).format('DD-MM-YYYY'),
      montant: somme(versements),
    }
  }
  return object
}
export const actions = {
  async getAll({ commit }) {
    const requete = await this.$axios.get('reception/encaissements')
    const factures = requete.data.encaissements.map((facture) => {
      return organiser(facture)
    })
    commit('ALL_FACTURES', factures)
  },
  async getSoldes({ commit }) {
    const requete = await this.$axios.get('reception/encaissements/soldes')
    const factures = requete.data.encaissements.map((facture) => {
      return organiser(facture)
    })
    commit('ALL_FACTURES', factures)
  },
  async getNonSoldes({ commit }) {
    const requete = await this.$axios.get('reception/encaissements/non-soldes')
    const factures = requete.data.encaissements.map((facture) => {
      return organiser(facture)
    })
    commit('ALL_FACTURES', factures)
  },
  async getByDate({ commit }, laDate) {
    const requete = await this.$axios.get('reception/encaissements/' + laDate)
    const factures = requete.data.encaissements.map((facture) => {
      const {
        attribution_linked,
        reservation_linked,
        versements,
        ...rest
      } = facture
      let object = {}
      if (Object.keys(attribution_linked).length > 0) {
        object = {
          ...rest,
          chambre: attribution_linked.chambre_linked.nom,
          client:
            attribution_linked.client_linked.nom +
            ' ' +
            attribution_linked.client_linked.prenom,
          versements,
          attribution: attribution_linked,
          montant: somme(versements),
        }
      } else if (Object.keys(reservation_linked).length > 0) {
        object = {
          ...rest,
          chambre: reservation_linked.chambre_linked.nom,
          client:
            reservation_linked.client_linked.nom +
            ' ' +
            reservation_linked.client_linked.prenom,
          versements,
          reservation: reservation_linked,
          montant: somme(versements),
        }
      }
      return object
    })
    commit('ALL_FACTURES', factures)
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'reception/encaissements/' + payload.id,
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('reception/encaissements/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async ajouter({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'reception/encaissements/new',
      payload
    )
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async encaisser({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'reception/encaissements/new',
      payload
    )
    dispatch('getNonSoldes')
    return { message: requete.data.message }
  },
}

export const mutations = {
  ALL_FACTURES(state, factures) {
    state.factures = factures
  },
}
