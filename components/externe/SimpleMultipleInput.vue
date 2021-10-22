<template>
  <v-container>
    <div v-for="(donnee, index) in donnees" :key="index">
      <v-row v-if="donnee">
        <v-col cols="7">
          <v-autocomplete
            v-model="donnee.id"
            :prepend-icon="`mdi-numeric-${index + 1}-box`"
            :items="elements"
            item-value="id"
            item-text="nom"
            dense
            :label="field"
            disabled
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="donnee.quantite"
            dense
            label="Quantité"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-btn color="error" icon @click="remove(index)"
            ><v-icon>mdi-trash-can-outline</v-icon></v-btn
          >
        </v-col>
      </v-row>
    </div>
    <div>
      <v-row>
        <v-col cols="7">
          <v-autocomplete
            v-model="current.id"
            :items="elements"
            item-value="id"
            item-text="nom"
            dense
            clearable
            :label="field"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="current.quantite"
            dense
            label="Quantité"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-btn color="primary darken-3" icon @click="add"
            ><v-icon>mdi-plus-thick</v-icon></v-btn
          >
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  props: {
    field: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
  },
  data: () => ({ elements: [], current: { id: '', quantite: '' } }),
  computed: {
    donnees: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  mounted() {
    this.filterSelectable()
  },
  methods: {
    filterSelectable() {
      this.elements = Object.assign([], this.items)
      this.items.forEach((item) => {
        const found = this.donnees.find((donnee) => donnee.id === item.id)
        if (found) {
          this.elements = this.elements.map((element) => {
            return element.id !== found.id
              ? element
              : { ...element, disabled: true }
          })
        }
      })
    },
    add() {
      if (this.current.id && this.current.quantite) {
        this.donnees.push(this.current)
        this.current = { id: '', quantite: '' }
        this.filterSelectable()
      } else {
        this.$notifier.show({
          text: 'veuillez remplir correctement les champs',
          variant: 'error',
        })
      }
    },
    remove(index) {
      this.donnees.splice(index, 1)
      this.filterSelectable()
    },
  },
}
</script>

<style></style>
