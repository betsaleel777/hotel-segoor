<template>
  <v-card elevation="2" shaped tile>
    <v-card-title class="headline grey lighten-1 primary--text">
      Entretiens
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
                  <calendrier-entretien
                    v-if="item.text === 'Programme d\'entretien'"
                  />
                  <archive-entretien
                    v-if="item.text === 'Entretiens Archivés'"
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
</template>

<script>
import SideMaintenance from '~/components/maintenance/SideMaintenance.vue'
import CalendrierEntretien from '~/components/maintenance/entretien/CalendrierEntretien.vue'
import ArchiveEntretien from '~/components/maintenance/entretien/ArchiveEntretien.vue'

export default {
  components: {
    SideMaintenance,
    CalendrierEntretien,
    ArchiveEntretien,
  },
  data: () => ({
    tab: null,
    items: [
      { text: "Programme d'entretien", icon: 'mdi-calendar' },
      { text: 'Entretiens Archivés', icon: 'mdi-archive' },
    ],
  }),
}
</script>

<style></style>
