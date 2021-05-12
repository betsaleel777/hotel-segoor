<script>
export default {
  data() {
    return {
      imagePreview: null,
    }
  },
  methods: {
    onFileChange(payload) {
      // if (payload) {
      //   this.imagePreview = URL.createObjectURL(payload)
      //   URL.revokeObjectURL(payload) // free memory
      // } else {
      //   this.imagePreview = null
      // }
    },
  },
}
</script>
