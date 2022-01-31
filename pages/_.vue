<template>
  <div></div>
</template>
<script>
export default {
  mounted() {
    this.$notifier.show({
      text: "Le chemin spécifié n'existe pas",
      variant: 'error',
    })
    this.$router.push('/')
  },
}
</script>
