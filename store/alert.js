export const state = () => ({
  text: '',
  variant: '',
})

export const mutations = {
  SHOW_MESSAGE(state, payload) {
    state.text = payload.text
    state.variant = payload.variant
  },
}

export const actions = {
  alerter({ commit }, payload) {
    commit('SHOW_MESSAGE', payload)
  },
}
