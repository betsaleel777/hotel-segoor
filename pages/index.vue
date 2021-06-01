<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-center justify-center">
        <segoor-logo />
        <!-- <v-alert outlined type="info" prominent border="right">
          l'avenir nous appartient, l'avenir c'est Segoor
        </v-alert> -->
      </div>
    </v-col>
  </v-row>
</template>

<script>
import SegoorLogo from '~/components/segoor'
export default {
  components: {
    SegoorLogo,
  },
}
</script>
