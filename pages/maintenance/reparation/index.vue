<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Réparations
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="2">
              <side-maintenance />
            </v-col>
            <v-col cols="12" sm="6" md="10">
              <v-tabs v-model="tab" fixed-tabs color="indigo darken-4">
                <v-tab v-for="(item, i) in items" :key="i">
                  <template #default>
                    <v-icon left>{{ item.icon }}</v-icon
                    ><span class="text-subtitle-2">{{ item.text }}</span>
                  </template>
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item v-for="(item, i) in items" :key="i">
                  <v-row>
                    <v-col cols="12">
                      <calendrier-reparation
                        v-if="item.text === 'Programme des réparations'"
                      />
                      <depense-reparation
                        v-if="item.text === 'Dépenses de réparations'"
                      />
                    </v-col>
                  </v-row>
                </v-tab-item>
              </v-tabs-items>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions></v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import SideMaintenance from '~/components/maintenance/SideMaintenance.vue'
import CalendrierReparation from '~/components/maintenance/reparation/CalendrierReparation.vue'
import DepenseReparation from '~/components/maintenance/reparation/DepenseReparation.vue'

export default {
  components: {
    SideMaintenance,
    CalendrierReparation,
    DepenseReparation,
  },
  data: () => ({
    tab: null,
    items: [
      { text: 'Programme des réparations', icon: 'mdi-calendar' },
      { text: 'Dépenses de réparations', icon: 'mdi-cash' },
    ],
  }),
}
</script>

<style></style>
