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
        delivre_le: { exist: false, message: null },
        expire_le: { exist: false, message: null },
        lieu_piece: { exist: false, message: null },
        maker: { exist: false, message: null },
        entree_pays: { exist: false, message: null },
      },
      menu2: false,
      menu3: false,
      menu4: false,
    }
  },
}

export default formPiece
