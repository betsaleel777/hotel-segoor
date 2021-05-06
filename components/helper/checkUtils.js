import moment from 'moment'
const checkReservationDate = (reservations) => {
  const tester = (reservation) => {
    const current = moment()
    const start = moment(reservation.entree)
    const end = moment(reservation.sortie)
    return current >= start && current <= end
  }
  return reservations.filter(tester)
}

export { checkReservationDate }
