<template>
  <v-card elevation="2" shaped tile>
    <v-card-title class="headline grey lighten-1 primary--text">
      Utilisateurs - Rôles
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <side-parametre />
        </v-col>
        <v-col cols="12" sm="6" md="9">
          <v-tabs v-model="tab" fixed-tabs color="indigo darken-4">
            <v-tab v-for="item in items" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item v-for="item in items" :key="item">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <liste-user
                    v-if="item === 'Utilisateurs'"
                    :roles="roles"
                    :users="users"
                  />
                  <liste-role
                    v-if="item === 'Rôles'"
                    :roles="roles"
                    :permissions="permissions"
                  />
                  <liste-permission
                    v-if="item === 'Permissions'"
                    :permissions="permissions"
                  />
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions></v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ListeUser from '~/components/parametre/user-role/user/listeUser.vue'
import SideParametre from '~/components/parametre/SideParametre.vue'
import ListeRole from '~/components/parametre/user-role/role/listeRole.vue'
import ListePermission from '~/components/parametre/user-role/permission/listePermission.vue'

export default {
  components: {
    SideParametre,
    ListeUser,
    ListeRole,
    ListePermission,
  },
  data: () => ({
    tab: null,
    items: ['Utilisateurs', 'Rôles', 'Permissions'],
  }),
  computed: {
    ...mapGetters('user', ['users']),
    ...mapGetters('role-permission/role', ['roles']),
    ...mapGetters('role-permission/permission', ['permissions']),
  },
  mounted() {
    this.getUsers()
    this.getRoles()
    this.getPermissions()
  },
  methods: {
    ...mapActions({
      getUsers: 'user/getAll',
      getRoles: 'role-permission/role/getAll',
      getPermissions: 'role-permission/permission/getAll',
    }),
  },
}
</script>

<style></style>
