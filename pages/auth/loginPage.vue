<template>
  <div id="app">
    <v-app dark="dark">
      <v-content>
        <v-container fill-height="fill-height">
          <v-layout align-center="align-center" justify-center="justify-center">
            <v-flex class="login-form text-xs-center">
              <div class="display-1 mb-3">
                <v-icon class="mr-2" large="large">work</v-icon>Krinjabo Hotel
              </div>
              <v-card light="light">
                <v-card-text>
                  <!-- <div class="subheading">
                    <template v-if="options.isLoggingIn"
                      >Se connecter au portail d'administration</template
                    >
                    <template v-else>Crate a new account</template>
                  </div> -->
                  <v-form>
                    <v-text-field
                      v-if="!options.isLoggingIn"
                      v-model="user.name"
                      light="light"
                      prepend-icon="person"
                      label="Name"
                    ></v-text-field>
                    <v-text-field
                      v-model="user.email"
                      light="light"
                      prepend-icon="email"
                      label="Email"
                      type="email"
                    ></v-text-field>
                    <v-text-field
                      v-model="user.password"
                      light="light"
                      prepend-icon="lock"
                      label="Password"
                      type="password"
                    ></v-text-field>
                    <!-- <v-checkbox
                      v-if="options.isLoggingIn"
                      v-model="options.shouldStayLoggedIn"
                      light="light"
                      label="Stay logged in?"
                      hide-details="hide-details"
                    ></v-checkbox> -->
                    <v-btn
                      v-if="options.isLoggingIn"
                      block="block"
                      type="submit"
                      @click.prevent=""
                      >Sign in</v-btn
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
      </v-content>
      <v-footer app="app">
        <v-flex class="text-xs-center">© 2021. All rights reserved.</v-flex>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
export default {
  data: () => ({
    // user: {
    //   email: 'admin@example.com',
    //   password: 'admin',
    //   name: 'John Doe',
    // },
    options: {
      isLoggingIn: true,
      // shouldStayLoggedIn: true,
    },
  }),
}
</script>

<style>
.login-form {
  max-width: 500px;
}
</style>
