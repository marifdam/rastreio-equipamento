<template class="mainMenu">
  <Header></Header>
  <div class="buttons">
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn
          @click="goToTracking"
          id="tracker"
          variant="elevated"
          prepend-icon="mdi-map-marker-radius-outline"
          size="large"
        >
          Rastrear seu equipamento
        </v-btn>
        <v-btn
          @click="goToDataAnalysis"
          id="data"
          variant="elevated"
          size="large"
          prepend-icon="mdi-chart-line"
          >Análise de dados</v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Header from "../components/headerMenu.vue";

export default defineComponent({
  components: { Header },
  setup() {
    const store = useStore();
    const router = useRouter();
    const items = [
      {
        name: "Rastrear pacote",
        value: "track",
      },
      {
        name: "Dados",
        value: "data",
      },
    ];
    const goToTracking = () => {
      router.push({ name: "tracking" });
    };
    const goToDataAnalysis = () => {
      router.push({ name: "dataAnalysis" });
    };
    return {
      goToTracking,
      goToDataAnalysis,
    };
  },
});
</script>
<style lang="scss">
@use "../styles/settings.scss";
#tracker,
#data {
  background-color: #d3d3d3;
  color: black;
  width: 30rem;
  height: 15rem;
  top: 5rem;
  margin-left: 2rem;
}
</style>
