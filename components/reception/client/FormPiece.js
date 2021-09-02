const formPiece = {
  data() {
    return {
      piece: {
        nature: null,
        numero_piece: null,
        delivre_le: null,
        expire_le: null,
        lieu_piece: null,
        maker: null,
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
