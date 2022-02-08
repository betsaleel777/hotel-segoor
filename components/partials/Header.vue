<template>
  <header
    class="side-header light-skin hdr-bg2-3 hdr-bgclr"
    :class="{ 'expand-header': !active }"
  >
    <div class="nav-head">
      {{ title }}
      <span
        class="menu-trigger"
        :class="{ active: active }"
        @click="active = !active"
        ><i class="ion-android-menu"></i
      ></span>
    </div>
    <nav class="custom-scrollbar">
      <ul class="drp-sec">
        <li
          v-for="(module, i) in modules"
          :key="i"
          v-can="module.permission"
          class="has-drp"
        >
          <a :href="module.to"
            ><v-icon left>{{ module.icon }}</v-icon>
            <span>{{ module.title }}</span></a
          >
        </li>
      </ul>
      <h4 v-can="externe">Extension</h4>
      <ul v-can="externe" class="drp-sec">
        <li
          class="has-drp"
          :class="{ active: activeExterne }"
          @click="activeExterne = !activeExterne"
        >
          <a href="#"
            ><i class="ion-briefcase"></i> <span>Restaurants Externes</span></a
          >
          <ul class="sb-drp" :style="{ display: displayable }">
            <li v-for="(restaurant, index) in restaurants" :key="index">
              <a :href="'/externe/' + restaurant.id">{{ restaurant.nom }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </header>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { AccesExterne } from '~/helper/permissions'
export default {
  data: () => ({
    externe: AccesExterne,
    active: false,
    activeExterne: false,
    title: 'Krinjabo Hotel',
  }),
  computed: {
    ...mapGetters(['modules']),
    ...mapGetters('externe/restaurant', ['restaurants']),
    displayable() {
      return this.activeExterne ? 'inline' : 'none'
    },
  },
  created() {
    if (this.$gates.hasPermission(AccesExterne)) this.getAll()
  },
  methods: {
    ...mapActions('externe/restaurant', ['getAll']),
  },
}
</script>
