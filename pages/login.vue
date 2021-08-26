<template>
  <v-container fill-height fluid>
    <v-layout align-center justify-center>
      <v-flex class="login-form text-xs-center">
        <div class="display-1 mb-3 text-center">
          <v-icon class="mr-2" large="large">mdi-account</v-icon>Krinjabo Hotel
        </div>
        <v-card light="light">
          <v-card-text>
            <div class="subheading text-center">
              <template v-if="options.isLoggingIn"
                >se connecter maintenant</template
              >
              <template v-else>Crer un compte</template>
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
              <v-checkbox
                v-if="options.isLoggingIn"
                v-model="options.shouldStayLoggedIn"
                light="light"
                label="Rester connecté ?"
                hide-details="hide-details"
              ></v-checkbox>
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
          </v-card-text>
        </v-card>
        <!-- <div v-if="options.isLoggingIn">
                Don't have an account?
                <v-btn light="light" @click="options.isLoggingIn = false"
                  >Sign up</v-btn
                >
              </div> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  auth: false,
  layout: 'login',
  data: () => ({
    email: '',
    password: '',
    options: {
      isLoggingIn: true,
      shouldStayLoggedIn: false,
    },
    errors: [],
  }),
  methods: {
    async login() {
      await this.$auth
        .loginWith('laravelJWT', {
          data: { email: this.email, password: this.password },
        })
        .then(() => {
          this.$router.push('/')
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

<style>
.login-form {
  max-width: 500px;
}
</style>
