import moment from 'moment'
const checkReservationDate = (reservations) => {
  const tester = (reservation) => {
    const current = moment()
    const start = moment(reservation.entree, 'X')
    const end = moment(reservation.sortie, 'X')
    return !(current.diff(start) < 0 || end.diff(current) < 0)
  }
  return reservations.filter(tester)
}

export { checkReservationDate }
