<template>
  <v-data-table
    no-data-text="Aucune Donnée"
    :loading="loading"
    loading-text="En chargement ..."
    :headers="headers"
    :items="factures"
    :search="search"
    :items-per-page="10"
  >
    <template #[`top`]>
      <v-toolbar flat>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="recherche ..."
          single-line
          hide-details
        ></v-text-field>
      </v-toolbar>
    </template>
    <template #[`item.date_soldee`]="{ item }">
      {{ $moment(item.date_soldee).format('ll') }}
    </template>
    <template #[`item.espece`]="{ item }">
      {{ item.espece | formater }}
    </template>
    <template #[`item.cheque`]="{ item }">
      {{ item.cheque | formater }}
    </template>
    <template #[`item.mobile`]="{ item }">
      {{ item.mobile | formater }}
    </template>
    <template #[`item.total`]="{ item }">
      {{ (item.espece + item.cheque + item.mobile) | formater }}
    </template>
    <!-- <template #[`item.actions`]="{ item }"> </template> -->
  </v-data-table>
</template>

<script>
export default {
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  props: {
    factures: {
      type: Array,
      required: true,
    },
    restaurant: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      search: '',
      loading: false,
      headers: [
        { text: 'Date', value: 'date_soldee', align: 'left', sortable: false },
        { text: 'Espèces', value: 'espece', align: 'center', sortable: false },
        { text: 'Cheque', value: 'cheque', align: 'center', sortable: false },
        { text: 'Mobile', value: 'mobile', align: 'center' },
        { text: 'Total', value: 'total', align: 'center' },
        { text: 'Actions', value: 'actions', align: 'right', sortable: false },
      ],
    }
  },
  methods: {},
}
</script>

<style></style>
