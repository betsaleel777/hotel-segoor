<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ on }">
      <v-btn color="success" text v-on="on"> attribuer </v-btn>
    </template>
    <v-card>
      <v-card-title class="justify-center primary--text headline"
        ><div>Confirmation d'attribution de chambre</div>
      </v-card-title>
      <v-card-text justify="center" align="center">
        Veuillez confirmer l'entrée du client
        <b>{{ item.client_linked.nom.toUpperCase() }}</b> en chambre
        <b>{{ item.chambre_linked.nom }}</b
        >.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="dialog = false">ANNULER</v-btn>
        <v-btn color="success" text @click="attribuate">CONFIRMER</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
    <edit-client
      v-if="dialogClient"
      v-model="dialogClient"
      :item="item.client_linked"
      @edited="onEdited"
    />
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import EditClient from '~/components/reception/client/EditClientDialog.vue'
export default {
  components: {
    EditClient,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => {
    return {
      dialog: false,
      dialogClient: false,
    }
  },
  methods: {
    ...mapActions({
      getOne: 'reception/client/getOne',
      attribuer: 'reception/attribution/attribuer',
      getReserved: 'reception/reservation/getReserved',
    }),
    attribuate() {
      if (this.$moment().isSame(this.$moment(this.item.entree), 'days')) {
        if (this.item.client_linked.status === 'incomplet') {
          this.$notifier.show({
            text: `le dossier du client ${this.item.client_linked.nom} est imcomplet, veuillez completer les informations de la pièce d'identité`,
            variant: 'info',
          })
          this.dialogClient = true
        } else {
          const postData = {
            entree: this.item.entree,
            sortie: this.item.sortie,
            accompagnants: this.item.accompagnants,
            destination: this.item.destination,
            reservation: this.item.id,
            remise: this.item.remise,
            chambre: this.item.chambre,
            client: this.item.client,
            prix: this.item.chambre_linked.prix_vente,
          }
          this.attribuer(postData).then((result) => {
            this.getReserved().then(() => {
              this.$notifier.show({ text: result.message, variant: 'success' })
              this.dialog = false
              this.$emit('reservation-converted')
            })
          })
        }
      } else {
        this.$notifier.show({
          text: `Impossible d'attribuer la chambre ${this.item.chambre_linked.nom} à cette date`,
          variant: 'error',
        })
      }
    },
    onEdited() {
      this.$emit('reservation-converted')
    },
  },
}
</script>

<style></style>
