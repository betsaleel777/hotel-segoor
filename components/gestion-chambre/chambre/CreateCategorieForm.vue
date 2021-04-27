<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn
        dark
        color="primary"
        elevation="4"
        fab
        small
        v-bind="attrs"
        v-on="on"
        ><v-icon dark>mdi-plus</v-icon></v-btn
      >
    </template>
    <v-card>
      <v-card-title>
        <span class="headline primary--text">Créer categorie</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="nom"
                  :error="errors.nom.exist"
                  :error-messages="errors.nom.message"
                  dense
                  outlined
                  label="Nom"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="reinitialise"> Fermer </v-btn>
        <v-btn color="blue darken-1" text @click="save"> Créer </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    nom: null,
    errors: { nom: { exist: false, message: null } },
  }),
  methods: {
    reinitialise() {
      this.dialog = false
      this.$refs.form.reset()
    },
    save() {
      this.$axios
        .post('api/gestion-chambre/categories/new', { nom: this.nom })
        .then((result) => {
          const { categorie } = result.data
          // notification
          this.$emit('new-categorie', categorie)
          this.reinitialise()
        })
        .catch((err) => {
          const { data } = err.response
          if (data) {
            this.$refs.form.reset()
            this.errorsWriting(data)
          }
        })
    },
    errorsWriting(errors) {
      if (errors.nom) {
        this.errors.nom.exist = true
        this.errors.nom.message = errors.nom[0]
      }
    },
  },
}
</script>

<style></style>
