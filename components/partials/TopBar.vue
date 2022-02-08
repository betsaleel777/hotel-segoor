<template>
  <div class="topbar">
    <div class="logo">
      <h1>
        <NuxtLink to="/"><img src="/images/logo1.png" alt="" /></NuxtLink>
      </h1>
    </div>
    <div class="topbar-data">
      <div
        class="usr-act"
        :class="activeMenu ? 'active' : ''"
        @click="onActiveMenu"
      >
        <span
          ><img src="/logo.jpg" height="40" width="40" alt="" /><i
            class="sts away"
          ></i
        ></span>
        <div class="usr-inf">
          <div class="usr-thmb brd-rd50 mb-">
            <img
              class="brd-rd50"
              src="/logo.jpg"
              height="100"
              width="100"
              alt=""
            />
            <i class="sts away"></i>
          </div>
          <h5>
            <a href="#" title="">{{ user.name }}</a>
          </h5>
          <span></span>
          <i>{{ user.email }}</i>
          <div class="act-pst-lk-stm"></div>
          <div class="usr-ft mt-5">
            <a class="btn-danger" @click="onLogout"
              ><i class="fa fa-sign-out"></i> Se decoonecter</a
            >
          </div>
        </div>
      </div>
    </div>
    <div class="topbar-bottom-colors">
      <i style="background-color: #bc382a"></i>
      <i style="background-color: #bc382a"></i>
      <i style="background-color: #bc382a"></i>
      <i style="background-color: #bc382a"></i>
      <i style="background-color: #bc382a"></i>
      <i style="background-color: #bc382a"></i>
      <i style="background-color: #bc382a"></i>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    activeMenu: false,
  }),
  methods: {
    onActiveMenu() {
      this.activeMenu = !this.activeMenu
    },
    onLogout() {
      this.$auth.logout('laravelJWT').then(() => {
        localStorage.clear()
      })
    },
  },
}
</script>
<style lang=""></style>
