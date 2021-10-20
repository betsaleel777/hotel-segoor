/* eslint-disable camelcase */
import collect from 'collect.js'
import moment from 'moment'
export const state = () => ({
  factures: [],
  facturesSoldees: [],
  facturesNonSoldees: [],
  facturesDateCompactees: [],
})
export const getters = {
  factures: (state) => {
    return state.factures
  },
  facturesSoldees: (state) => {
    return state.facturesSoldees
  },
  facturesNonSoldees: (state) => {
    return state.facturesNonSoldees
  },
  facturesDateCompactees: (state) => {
    return state.facturesDateCompactees
  },
}

const aPayer = function (hebergement) {
  return hebergement.remise === undefined
    ? moment(hebergement.sortie).diff(hebergement.entree, 'days') *
        hebergement.prix
    : moment(hebergement.sortie).diff(hebergement.entree, 'days') *
        Math.round(hebergement.prix * (1 - hebergement.remise / 100))
}
const somme = function (versements) {
  let sum = 0
  versements.forEach((versement) => {
    sum += versement.montant - versement.monnaie
  })
  return sum
}
const sommeEspece = function (versements) {
  let sum = 0
  versements.forEach((versement) => {
    if (versement.espece) sum += versement.montant - versement.monnaie
  })
  return sum
}
const sommeMobile = function (versements) {
  let sum = 0
  versements.forEach((versement) => {
    if (versement.mobile_money) sum += versement.montant - versement.monnaie
  })
  return sum
}
const sommeCheque = function (versements) {
  let sum = 0
  versements.forEach((versement) => {
    if (versement.cheque) sum += versement.montant - versement.monnaie
  })
  return sum
}
const organiser = function (facture) {
  const {
    attribution_linked,
    reservation_linked,
    versements,
    created_at,
    date_soldee,
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
      created_at: moment(created_at).format('YYYY-MM-DD'),
      date_soldee: moment(date_soldee).format('YYYY-MM-DD'),
      espece: sommeEspece(versements),
      cheque: sommeCheque(versements),
      mobile: sommeMobile(versements),
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
      created_at: moment(created_at).format('YYYY-MM-DD'),
      date_soldee: moment(date_soldee).format('YYYY-MM-DD'),
      espece: sommeEspece(versements),
      cheque: sommeCheque(versements),
      mobile: sommeMobile(versements),
    }
  }
  return object
}
const organiserNonSoldees = function (facture) {
  const {
    attribution_linked,
    reservation_linked,
    versements,
    created_at,
    date_soldee,
    ...rest
  } = facture
  let object = {}
  if (attribution_linked) {
    const montant = somme(versements)
    const reste = aPayer(attribution_linked) - montant
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
      date_soldee: moment(date_soldee).format('DD-MM-YYYY'),
      montant,
      reste,
    }
  } else if (reservation_linked) {
    const montant = somme(versements)
    const reste = aPayer(reservation_linked) - montant
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
      date_soldee: moment(date_soldee).format('DD-MM-YYYY'),
      montant,
      reste,
    }
  }
  return object
}
export const actions = {
  async getAll({ commit }) {
    commit('SET_FACTURES', [])
    const requete = await this.$axios.get('reception/encaissements')
    const factures = requete.data.encaissements.map((facture) => {
      return organiser(facture)
    })
    commit('SET_FACTURES', factures)
  },
  async getSoldesCompact({ commit }) {
    commit('SET_COMPACT', [])
    const requete = await this.$axios.get('reception/encaissements/soldes')
    let factures = requete.data.encaissements.map((facture) => {
      return organiser(facture)
    })
    factures = collect(factures)
      .groupBy('date_soldee')
      .map((lignes, index) => {
        let cheque = 0
        let mobile = 0
        let espece = 0
        lignes.all().forEach((ligne) => {
          mobile += Number(ligne.mobile)
          cheque += Number(ligne.cheque)
          espece += Number(ligne.espece)
        })
        return { mobile, cheque, espece, date_soldee: index }
      })
      .toArray()
    commit('SET_COMPACT', factures)
  },
  async getSoldes({ commit }) {
    commit('SET_FACTURES_SOLDEES', [])
    const requete = await this.$axios.get('reception/encaissements/soldes')
    const factures = requete.data.encaissements.map((facture) => {
      return organiser(facture)
    })
    commit('SET_FACTURES_SOLDEES', factures)
  },
  async getNonSoldes({ commit }) {
    commit('SET_FACTURES_SOLDEES', [])
    const requete = await this.$axios.get('reception/encaissements/non-soldes')
    const factures = requete.data.encaissements.map((facture) => {
      return organiserNonSoldees(facture)
    })
    commit('SET_FACTURES_NON_SOLDEES', factures)
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
    return factures
  },
  async modifier({ dispatch }, payload) {
    const requete = await this.$axios.put(
      'reception/encaissements/' + payload.id,
      payload
    )
    dispatch('getNonSoldes')
    dispatch('getSoldes')
    dispatch('getSoldesCompact')
    return { message: requete.data.message }
  },
  async supprimer({ dispatch }, id) {
    const requete = await this.$axios.delete('reception/encaissements/' + id)
    dispatch('getAll')
    return { message: requete.data.message }
  },
  async encaisser({ dispatch }, payload) {
    const requete = await this.$axios.post(
      'reception/encaissements/new',
      payload
    )
    dispatch('getNonSoldes')
    dispatch('getSoldes')
    dispatch('getSoldesCompact')
    return {
      message: requete.data.message,
      status: requete.data.status,
      versement: requete.data.versement,
    }
  },
}

export const mutations = {
  SET_FACTURES(state, factures) {
    state.factures = factures
  },
  SET_FACTURES_SOLDEES(state, factures) {
    state.facturesSoldees = factures
  },
  SET_FACTURES_NON_SOLDEES(state, factures) {
    state.facturesNonSoldees = factures
  },
  SET_COMPACT(state, facturesCompactees) {
    state.facturesDateCompactees = facturesCompactees
  },
}
