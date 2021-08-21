const formPiece = {
  data() {
    // const today = new Date().toISOString().substr(0, 10)
    return {
      piece: {
        nature: '',
        numero_piece: '',
        delivre_le: '',
        expire_le: '',
        lieu_piece: '',
        maker: '',
        entree_pays: null,
      },
      errors: {
        nature: { exist: false, message: null },
        numero_piece: { exist: false, message: null },
      },
    }
  },
}

export default formPiece
