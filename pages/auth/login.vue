<template>
  <div class="panel-content">
    <div class="lgn-wrp grysh overflow-hidden">
      <div class="bg-img" style="background-image: url(/logo.jpg)"></div>
      <div class="lgn-innr">
        <div class="widget lgn-frm">
          <div class="frm-tl">
            <h4>Connectez-vous</h4>
            <span>Remplissez vos coordonnées pour entrer</span>
          </div>
          <v-form>
            <v-text-field
              v-if="!options.isLoggingIn"
              v-model="name"
              light="light"
              prepend-icon="mdi-person"
              label="Nom"
            ></v-text-field>
            <v-text-field
              v-model="email"
              light="light"
              prepend-icon="mdi-email"
              label="Email"
              type="email"
            ></v-text-field>
            <v-text-field
              v-model="password"
              light="light"
              prepend-icon="mdi-lock"
              label="Mot de passe"
              type="password"
            ></v-text-field>
            <!-- <v-checkbox
              v-if="options.isLoggingIn"
              v-model="options.shouldStayLoggedIn"
              light="light"
              label="Rester connecté ?"
              hide-details="hide-details"
            ></v-checkbox> -->
            <v-btn
              v-if="options.isLoggingIn"
              class="mt-3"
              block="block"
              type="submit"
              color="blue darken-4"
              @click.prevent="login"
              >Connexion</v-btn
            >
            <v-btn
              v-else
              block="block"
              type="submit"
              @click.prevent="options.isLoggingIn = true"
              >Sign up</v-btn
            >
          </v-form>
        </div>
      </div>
      <footer>
        <span>Build by</span>
        <span class="ml-2">
          <a href="https://segoor.net" target="_blank">
            <img src="/segoor-favi.png" /> Segoor
          </a>
        </span>
      </footer>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'login',
  data: () => ({
    email: '',
    password: '',
    options: {
      isLoggingIn: true,
      shouldStayLoggedIn: false,
    },
  }),
  methods: {
    async login() {
      await this.$auth
        .loginWith('laravelJWT', {
          data: { email: this.email, password: this.password },
        })
        .then(() => {
          this.$gates.setPermissions(this.user.permissions)
          this.$gates.setRoles(this.user.roles)
        })
        .catch((err) => {
          this.$notifier.show({
            text: err.response.data.error,
            variant: 'error',
          })
        })
    },
  },
}
</script>
