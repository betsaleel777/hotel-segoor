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
          v-can="module.permission"
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
        <v-list-group>
          <template #activator>
            <v-list-item-action>
              <v-icon color="blue darken-4">mdi-food-fork-drink</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Restaurants externes</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="(restaurant, index) in restaurants"
            :key="index"
            :to="'/externe/' + restaurant.id"
            router
            exact
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ restaurant.nom }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <edit-restaurant :item="restaurant" />
            </v-list-item-icon>
          </v-list-item>
          <v-list-item>
            <create-restaurant />
          </v-list-item>
        </v-list-group>
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
      <div v-if="isAuthenticated" class="text-center">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-width="100"
          open-on-hover
          offset-y
        >
          <template #activator="{ on, attrs }">
            <v-btn color="indigo" text dark v-bind="attrs" v-on="on">
              connecté
            </v-btn>
          </template>

          <v-card>
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <img src="/segoor.jpg" :alt="'utilisateur'" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ user.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    user.roles[0].name
                  }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-tooltip bottom>
                    <template #activator="{ on, attrs }">
                      <v-btn
                        class="red--text"
                        icon
                        v-bind="attrs"
                        @click="logout"
                        v-on="on"
                      >
                        <v-icon>mdi-logout-variant</v-icon>
                      </v-btn>
                    </template>
                    <span>déconnexion</span>
                  </v-tooltip>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>
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
import { mapGetters, mapActions } from 'vuex'
import AlertComponent from '~/components/AlertComponent'
import SnackbarComponent from '~/components/SnackbarComponent'
import CreateRestaurant from '~/components/externe/restaurant/CreateRestaurantExterne'
import EditRestaurant from '~/components/externe/restaurant/EditRestaurantExterne.vue'
export default {
  components: {
    SnackbarComponent,
    AlertComponent,
    CreateRestaurant,
    EditRestaurant,
  },
  data() {
    return {
      menu: false,
      dialog: false,
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
    ...mapGetters('externe/restaurant', ['restaurants']),
  },
  mounted() {
    this.$gates.setPermissions(this.user.permissions)
    this.getAll()
  },
  methods: {
    ...mapActions('externe/restaurant', ['getAll']),
    logout() {
      this.$auth.logout('laravelJWT').then(() => {
        localStorage.clear()
        location.reload()
      })
    },
  },
}
</script>
