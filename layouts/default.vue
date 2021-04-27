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
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
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
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-alert
          :value="alert"
          class="my-6"
          border="right"
          prominent
          outlined
          text
          :type="variant"
          dismissible
        >
          {{ textAlert }}
        </v-alert>
        <nuxt />
        <v-snackbar
          :value="snackbar"
          color="primary lighten-2"
          dark
          text
          absolute
          bottom
          :timeout="timeout"
        >
          {{ textSnack }}
        </v-snackbar>
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
        lovely powered by
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
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Dashboard',
          to: '/',
        },
        {
          icon: 'mdi-home-city',
          title: 'Gestion des chambres',
          to: '/gestion-chambre',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Krinjabo Hotel',
    }
  },
  computed: {
    textSnack() {
      return this.$store.state.snackbar.text
    },
    textAlert() {
      return this.$store.state.alert.text
    },
    variant() {
      return this.$store.state.alert.variant
    },
    snackbar() {
      return this.$store.state.snackbar.visible
    },
    alert() {
      return this.$store.state.alert.visible
    },
    timeout() {
      return this.$store.state.snackbar.timeout
    },
  },
  mounted() {},
}
</script>
