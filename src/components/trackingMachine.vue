<template>
  <Header></Header>
  <div class="search-area">
    <v-select class="selection" clearable :items="items" items-title="title" items-value="value"
      v-model="selectedOption" density="default" label="Filtrar por"></v-select>
    <v-text-field class="search" label="Pesquisar" append-inner-icon="mdi-magnify" v-model="dataInput"
      @click:append-inner="search"></v-text-field>
  </div>
  <GoogleMaps class="maps" :position="positions"></GoogleMaps>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Header from './headerMenu.vue';
import GoogleMaps from './googleMaps.vue';

export default defineComponent({
  components: { Header, GoogleMaps },
  setup() {
    const store = useStore();
    const dataInput = ref('');
    let positions = ref({ lat: 0, lng: 0 })
    const selectedOption = ref('Selecione');
    const items = [
      { title: "ESTADO", value: "state" },
      { title: "MODELO", value: "model" },
      { title: "NOME", value: "nome" }
    ];

    const search = async () => {
      await store.dispatch('search', {
        selection: selectedOption.value,
        input: dataInput.value
      })
      const lastPosition = await store.getters["getLastSearch"]
      positions.value = {
        lat: parseFloat(lastPosition.positions[0].lat),
        lng: parseFloat(lastPosition.positions[0].lon)

      }
    }


    onMounted(() => {
      store.dispatch('populateFields');
    });

    return {
      dataInput,
      selectedOption,
      items,
      positions,
      search
    };
  }
});
</script>

<style lang="scss">
@use '../styles/settings.scss';

.search-area {
  display: grid;
  position: relative;
  left: 3rem;
  top: 3rem;
}

.selection {
  position: relative;
  color: black;
  width: 16rem;
  left: 23rem;
  top: 3rem;
}

.search {
  position: relative;
  color: black;
  width: 16rem;
  left: 39rem;
  bottom: 38%;
}

.maps {
  position: relative;
  left: 26rem;
}
</style>
