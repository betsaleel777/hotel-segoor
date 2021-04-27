export const state = () => ({
  modules: [
    {
      icon: 'mdi-bed-empty',
      text: 'Chambres',
      to: '/gestion-chambre/chambre',
    },
    {
      icon: 'mdi-cog',
      text: 'Maintenances',
      to: '/gestion-chambre/maintenance',
    },
  ],
  alert: {
    variant: 'info',
    text: '',
    visible: false,
  },
  snackbar: {
    timeout: -1,
    text: '',
    visible: false,
  },
})

export const mutations = {
  ALERTER: (state, text, variant = 'info') => {
    state.alert = { variant, text, visible: true }
  },
  SNACKBAR: (state, text, timeout = 4000) => {
    state.snackbar = { timeout, text, visible: true }
  },
}
