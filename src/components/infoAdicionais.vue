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
      ></v-text-field>
    </div>
    <div id="tableInfo">
      <v-data-table
        theme="light"
        :headers="headers"
        :items="items"
        density="compact"
        item-key="name"
      >
      </v-data-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const input = ref();
const store = useStore();
const router = useRouter();
const dataInput = ref();
const totalHours = ref(0);
let operating = ref(0);
let mainteinance = ref(0);
let stopped = ref(0);
let earning = 0;
const headers = [
  {
    title: "Operando %",
    align: "start" as const,
    value: "operating",
    sortable: false,
  },
  {
    title: "Parado ou manutenção%",
    align: "start" as const,
    value: "stopped",
    sortable: false,
  },
  {
    title: "Ganho",
    align: "start" as const,
    value: "earning",
    sortable: false,
  },
];
const items = ref([
  {
    operating: parseFloat(operating.value.toFixed(2)),
    stopped: parseFloat(stopped.value.toFixed(2)),
    earning: earning,
  },
]);

async function search(model: string, input: string) {
  await store.dispatch("search", {
    selection: model,
    input: input,
  });
  calculateHours();
}

const calculateHours = async () => {
  const database = await store.getters["getLastSearch"];

  if (database && database.state && database.state.length > 1) {
    for (let i = 1; i < database.state.length; i++) {
      const previousDate = new Date(database.state[i - 1].date);
      const currentDate = new Date(database.state[i].date);
      const differenceInMilliseconds =
        currentDate.getTime() - previousDate.getTime();
      const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
      totalHours.value += differenceInHours;
      earning += Number(database.state[i].value);
      switch (database.state[i].status) {
        case "Operando":
          operating.value += differenceInHours;
          break;
        case "Manutenção":
          mainteinance.value += differenceInHours;
          break;
        case "Parado":
          stopped.value += differenceInHours;
          break;
        default:
      }
    }

    operating.value = (operating.value * 100) / totalHours.value;
    mainteinance.value = (mainteinance.value * 100) / totalHours.value;
    stopped.value =
      (stopped.value * 100) / totalHours.value + mainteinance.value;
    items.value = [
      {
        operating: parseFloat(operating.value.toFixed(2)),
        stopped: parseFloat(stopped.value.toFixed(2)),
        earning: earning,
      },
    ];
  }
};

onMounted(async () => {
  input.value = router.currentRoute.value.params.model;
  store.dispatch("populateFields");

  if (input.value) {
    await store.dispatch("search", {
      selection: "model",
      input: input.value,
    });
    calculateHours();
  }
});
</script>

<style lang="scss" scoped>
@use "../styles/settings.scss";
.v-window-item {
  background-color: black;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.model {
  color: black;
}

#tableInfo {
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
