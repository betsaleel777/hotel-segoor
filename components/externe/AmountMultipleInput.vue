<template>
  <v-container>
    <div v-for="(donnee, index) in donnees" :key="index">
      <v-row v-if="donnee">
        <v-col cols="4">
          <v-autocomplete
            v-model="donnee.code"
            :items="elements"
            item-value="code"
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
            :suffix="donnee.contenance ? 'btl' : donnee.mesure"
            min="0"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            :value="amount(donnee)"
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
            v-model="current"
            return-object
            :items="elements"
            item-value="code"
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
            label="Prix unitaire"
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
            :suffix="current.contenance ? 'btl' : current.mesure"
            min="0"
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
    current: { id: '', code: '', prix: '', quantite: '', montant: '' },
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
  watch: {
    'current.quantite'(value) {
      if (Number(value) !== 0 && this.current.prix !== 0) {
        this.current.montant = Number(this.current.prix) * Number(value)
      }
    },
    'current.prix'(value) {
      if (Number(value) !== 0 && this.current.quantite !== 0) {
        this.current.montant = Number(this.current.quantite) * Number(value)
      }
    },
  },
  mounted() {
    this.filterSelectable()
  },
  methods: {
    setPrice() {
      if (this.current) {
        const currentElement = this.elements.find(
          (element) => this.current.code === element.code
        )
        if (this.readOnlyPrice) {
          this.current.prix = currentElement.prix
        }
        this.current.code = currentElement.code
        this.current.id = currentElement.id
      } else {
        this.current = { id: '', code: '', prix: '', quantite: '', montant: '' }
      }
    },
    amount(item) {
      return Number(item.quantite) * Number(item.prix)
    },
    filterSelectable() {
      this.elements = JSON.parse(JSON.stringify(this.items))
      this.items.forEach((item) => {
        let found = {}
        found = this.donnees.find((donnee) => donnee.code === item.code)
        if (found) {
          this.elements = this.elements.map((element) => {
            return element.code !== found.code
              ? element
              : { ...element, disabled: true }
          })
        }
      })
    },
    add() {
      if (this.current.code && this.current.quantite && this.current.prix) {
        const currentElement = this.elements.find(
          (element) => this.current.code === element.code
        )
        if (currentElement.genre) {
          this.current.genre = currentElement.genre
        }
        this.donnees.push(this.current)
        this.current = { id: '', code: '', prix: '', quantite: '', montant: '' }
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
