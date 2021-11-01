<template>
  <v-container>
    <div v-for="(donnee, index) in donnees" :key="index">
      <v-row v-if="donnee">
        <v-col cols="4">
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
        <v-col cols="2">
          <v-text-field
            v-model="donnee.prix"
            dense
            label="Prix"
            type="number"
            min="0"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="donnee.quantite"
            dense
            label="Quantité"
            type="number"
            min="0"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="donnee.montant"
            dense
            label="Montant"
            type="number"
            min="0"
            suffix="FCFA"
            readonly
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
        <v-col cols="4">
          <v-autocomplete
            v-model="current.id"
            :items="elements"
            item-value="id"
            item-text="nom"
            dense
            clearable
            :label="field"
            :attach="true"
            @change="setPrice"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="current.prix"
            dense
            label="Prix"
            type="number"
            min="0"
            :readonly="readOnlyPrice"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="current.quantite"
            dense
            label="Quantité"
            type="number"
            min="0"
            @change="
              current.montant = Number(current.prix) * Number(current.quantite)
            "
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="current.montant"
            dense
            label="Montant"
            type="number"
            min="0"
            suffix="FCFA"
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-btn color="primary darken-3" icon @click="add"
            ><v-icon>mdi-plus-thick</v-icon></v-btn
          >
        </v-col>
      </v-row>
    </div>
    <v-divider></v-divider>
    <p>
      <b>Total acheté: {{ total | formater }}</b>
    </p>
  </v-container>
</template>

<script>
export default {
  filters: {
    formater(value) {
      return `${Intl.NumberFormat().format(value)} FCFA`
    },
  },
  props: {
    field: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    readOnlyPrice: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    elements: [],
    current: { id: '', prix: '', quantite: '', montant: '' },
  }),
  computed: {
    total() {
      let sum = 0
      this.donnees.forEach((donnee) => {
        sum += Number(donnee.prix) * Number(donnee.quantite)
      })
      return sum
    },
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
    setPrice() {
      if (this.current.id) {
        const currentElement = this.elements.find(
          (element) => this.current.id === element.id
        )
        this.current.prix = currentElement.prix
      } else {
        this.current = { id: '', prix: '', quantite: '', montant: '' }
      }
    },
    filterSelectable() {
      this.elements = Object.assign([], this.items)
      this.items.forEach((item) => {
        let found = {}
        if (item.genre) {
          found = this.donnees.find(
            (donnee) => donnee.id === item.id && donnee.genre === item.genre
          )
        } else {
          found = this.donnees.find((donnee) => donnee.id === item.id)
        }
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
      if (this.current.id && this.current.quantite && this.current.prix) {
        const currentElement = this.elements.find(
          (element) => this.current.id === element.id
        )
        if (currentElement.genre) {
          this.current.genre = currentElement.genre
        }
        this.donnees.push(this.current)
        this.current = { id: '', prix: '', quantite: '', montant: '' }
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
