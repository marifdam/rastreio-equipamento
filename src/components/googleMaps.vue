<template>
  <GMapMap
    :center="center"
    :zoom="10"
    map-type-id="terrain"
    style="width: 70rem; height: 400px"
  >
    <GMapCluster>
      <GMapMarker
        v-for="(marker, index) in markers"
        :key="index"
        :position="marker"
        :clickable="true"
        :draggable="true"
        @click="openInfoWindow(marker)"
      >
        <GMapInfoWindow
          class="info"
          :closeclick="true"
          @closeclick="openedMarker = null"
          :options="{ content: infoContent }"
          :opened="openedMarker === marker"
        >
        </GMapInfoWindow>
      </GMapMarker>
    </GMapCluster>
  </GMapMap>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";

interface Position {
  lat: number;
  lng: number;
  equipmentName?: string;
  equipmentModel?: string;
  status?: string;
  statusColor?: string;
}

export default defineComponent({
  props: {
    positions: {
      type: Array as () => Position[],
      default: () => [],
    },
  },
  setup(props) {
        const router = useRouter();

    const center = ref<Position>({ lat: 51.093048, lng: 6.84212 });
    const markers = ref<Position[]>(props.positions);

    const openedMarker = ref<Position | null>(null);

    const infoContent = ref<string>("");

    const openInfoWindow = (marker: Position) => {
      center.value = marker;
      openedMarker.value = marker;
      infoContent.value = `
    <div style="color: black; bottom:30rem;">
      Nome do equipamento: ${marker.equipmentName }<br>
      Modelo: ${marker.equipmentModel}<br>
      Estado: ${marker.status}
      <br><br>
      <button onclick='viewHistory(${JSON.stringify(marker.equipmentModel)})' style="color:blue; top:30rem">Ver Histórico</button>
    </div>
  `;
    };

    const viewHistory = (equipmentModel:string) => {
      router.push({name: "dataAnalysisWithModel", params:{
        model:equipmentModel
      }})
    };

    onMounted(() => {
      (window as any).viewHistory = viewHistory;
    });
    watch(
      () => props.positions,
      (newPositions) => {
        if (newPositions.length > 0) {
          markers.value = newPositions;
          center.value = newPositions[0];
        }
      },
      { immediate: true },
    );

    return {
      center,
      markers,
      openInfoWindow,
      openedMarker,
      infoContent,
    };
  },
});
</script>

<style lang="scss">
@use "../styles/settings.scss";
</style>
