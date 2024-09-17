<template>
  <div class="trackingMachine">
  <Header></Header>
  <div class="search-area">
    <v-select
      class="selection"
      theme="light"
      clearable
      :items="items"
      items-title="title"
      items-value="value"
      v-model="selectedOption"
      density="default"
      label="Modo de pesquisa"
    ></v-select>
    <v-text-field
      class="search"
      label="Pesquisar"
      append-inner-icon="mdi-magnify"
      v-model="dataInput"
      @click:append-inner="search"
    ></v-text-field>
  </div>
  <GoogleMaps class="maps" :positions="positions"></GoogleMaps>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from "vuex";
import Header from "./headerMenu.vue";
import GoogleMaps from "./googleMaps.vue";

interface Position {
  lat: number;
  lng: number;
}

export default defineComponent({
  components: { Header, GoogleMaps },
  setup() {
    const store = useStore();
    const dataInput = ref("");
    const positions = ref<Position[]>([]);
    const selectedOption = ref("Selecione");
    const items = [
      { title: "ESTADO", value: "state" },
      { title: "MODELO", value: "model" },
      { title: "NOME", value: "nome" },
    ];

    const search = async () => {
      await store.dispatch("search", {
        selection: selectedOption.value,
        input: dataInput.value,
      });
      const lastPosition = await store.getters["getLastSearch"];
      positions.value = [
        {
          lat: parseFloat(lastPosition.positions[0].lat),
          lng: parseFloat(lastPosition.positions[0].lon),
        },
      ];
    };

    onMounted(async () => {
      store.dispatch("populateFields");
      const initialPositions = await store.dispatch("initPositions");
      positions.value = initialPositions;
    });

    return {
      dataInput,
      selectedOption,
      items,
      positions,
      search,
    };
  },
});
</script>

<style lang="scss">
@use "../styles/settings.scss";


.trackingMachine {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  width: 100%;
  height: 100vh; 
  box-sizing: border-box; 
}

.search-area {
  display: flex;

}

.selection{
  max-width: 250px; 
  width: 12rem;
  color:black
}

.search {
  max-width: 250px; 
  color:black;
  width: 20rem;
}

.maps {
  width: 100%;
  max-width: 800px; 
  height: 400px; 
  margin-right: 19rem;
}

</style>
