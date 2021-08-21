<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(module, i) in modules"
          :key="i"
          :to="module.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon color="blue darken-4">{{ module.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="module.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <!-- <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn> -->
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <!-- <div class="text-center">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-width="100"
          open-on-hover
          offset-y
        >
          <template #activator="{ on, attrs }">
            <v-btn color="indigo" text dark v-bind="attrs" v-on="on">
              {{ 'nom utilisateur' }}
            </v-btn>
          </template>

          <v-card>
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <img src="/segoor.jpg" :alt="'utilisateur'" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ 'nom utilisateur' }}</v-list-item-title>
                  <v-list-item-subtitle>Administrateur</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list>
              <v-list-item-icon>
                <v-icon color="orange darken-2" v-text="'mdi-account'"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="'profile'"></v-list-item-title>
              </v-list-item-content>
            </v-list>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="menu = false"> Fermer </v-btn>
              <v-btn color="error" text @click="logout"> Deconnexion </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div> -->
      <!-- <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <alert-component />
        <nuxt />
        <snackbar-component />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <span>
        lovely designed by
        <a
          href="http://www.segoor.com"
          target="_blank"
          rel="noopener noreferrer"
          >segoor</a
        >
        &copy; {{ new Date().getFullYear() }}
      </span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import AlertComponent from '~/components/AlertComponent.vue'
import SnackbarComponent from '~/components/SnackbarComponent.vue'
export default {
  components: { SnackbarComponent, AlertComponent },
  data() {
    return {
      menu: false,
      clipped: false,
      drawer: true,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Krinjabo Hotel',
    }
  },
  computed: {
    ...mapGetters(['modules']),
  },
  methods: {
    async logout() {},
  },
}
</script>
