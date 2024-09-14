<template class="mainMenu">
  <Header></Header>
  <div class="buttons">
    <v-row align="center" justify="center">
      <v-col cols="auto" >
        <v-btn @click="goToTracking" id="tracker" variant="elevated" prepend-icon="mdi-map-marker-radius-outline" size="large">
          Rastrear seu equipamento
        </v-btn>
        <v-btn @click="goToDataAnalysis" id="data" variant="elevated" size="large" prepend-icon="mdi-chart-line">Análise de dados</v-btn>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import Header from "../components/headerMenu.vue"

export default {
  components:{Header},
  data: function () {
    return {
      items: [{
        name: "Rastrear pacote",
        value: "track"
      },
      {
        name: "Dados",
        value: "data"
      }

      ]
    }
  },
  methods: {
    goToTracking() {
      this.$router.push({name:"tracking"})
    },
    goToDataAnalyse() {
      this.$router.push({name:"dataAnalysis"})
    },

  }
}
</script>
<style lang="scss">
@use '../styles/settings.scss';
#tracker,
#data {
  background-color: #D3D3D3;
  color: black;
  width: 30rem;
  height: 15rem;
  top: 5rem;
  margin-left: 2rem;
}
</style>