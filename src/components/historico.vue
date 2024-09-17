<template>
  <div class="container">
    <div class="model" v-if="input">
      <h1>Modelo {{ input }}</h1>
    </div>
    <div id="searchForModel" v-if="!input">
      <v-text-field
        class="search"
        label="Pesquisar por modelo"
        append-inner-icon="mdi-magnify"
        v-model="dataInput"
        @click:append-inner="search('model', dataInput)"
        @keyup.enter="search('model', dataInput)"
      ></v-text-field>
    </div>
    <div id="table">
      <v-data-table
        theme="light"
        :headers="headers"
        :items="formattedItems"
        density="compact"
        item-key="name"
      >
      </v-data-table>
    </div>
    <div class="trajeto">
      <h1>Trajeto</h1>
    </div>
    <GoogleMaps :path="path"></GoogleMaps>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import moment from "moment";
import GoogleMaps from "./googleMaps.vue";

interface Item {
  date: string;
  status: string;
}

interface Path {
  lat: number;
  lng: number;
}

const items = ref<Item[]>([]);
const dataInput = ref<string>("");
const path = ref<Path[]>([]);

const headers = [
  { title: "Data", align: "start" as const, value: "date", sortable: false },
  {
    title: "Status",
    align: "start" as const,
    value: "status",
    sortable: false,
  },
];

const input = ref();
const store = useStore();
const router = useRouter();

async function search(model: string, input: string) {
  const data = await store.dispatch("search", {
    selection: model,
    input: input,
  });
  items.value = data.state;
  path.value = data.positions.map((pos: any) => ({
      lat: parseFloat(pos.lat),
      lng: parseFloat(pos.lon),
    }));
}

onMounted(async () => {
  input.value = router.currentRoute.value.params.model;
  store.dispatch("populateFields");

  if (input.value) {
    const data = await store.dispatch("search", {
      selection: "model",
      input: input.value,
    });
    items.value = data.state;
    path.value = data.positions.map((pos: any) => ({
      lat: parseFloat(pos.lat),
      lng: parseFloat(pos.lon),
    }));
  }
});

const formattedItems = computed(() => {
  return items.value.map((item) => ({
    ...item,
    date: moment(item.date).format("DD-MM-YYYY HH:mm:ss"),
  }));
});
</script>

<style lang="scss" scoped>
@use "../styles/settings.scss";

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.model {
  color: black;
}
.trajeto {
  color: black;
  padding-top: 3rem;
}

#table {
  width: 100%;
  max-width: 1200px;
}

.searchForModel {
  display: flex;
  justify-content: center;
  width: 100%;
}

.search {
  width: 30%;
  min-width: 250px;
}

.v-data-table {
  width: 100%;
}
</style>
