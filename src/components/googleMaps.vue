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
        :icon="marker.icon"
        @click="openInfoWindow(marker)"
      >
        <GMapInfoWindow
          class="info"
          :closeclick="true"
          @closeclick="openedMarker = null"
          :options="{ content: infoContent }"
          :opened="openedMarker === marker"
        />
      </GMapMarker>
      <GMapPolyline :path="path" :options="polylineOptions" />
    </GMapCluster>
  </GMapMap>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";

interface Path {
  lat: number;
  lng: number;
}
interface Position {
  lat: number;
  lng: number;
  equipmentName?: string;
  equipmentModel?: string;
  status?: string;
  statusColor?: string;
  icon?: string;
}

export default defineComponent({
  props: {
    positions: {
      type: Array as () => Position[],
      default: () => [],
    },
    path: {
      type: Array as () => Path[],
      default: () => [],
    },
  },
  setup(props) {
    const router = useRouter();

    const center = ref<Position>({ lat: -22.908333, lng: -43.196388 });
    const markers = ref<Position[]>(props.positions);
    const path = ref<Path[]>(props.path);

    const openedMarker = ref<Position | null>(null);

    const infoContent = ref<string>("");

    const openInfoWindow = (marker: Position) => {
      center.value = marker;
      openedMarker.value = marker;
      infoContent.value = `
    <div style="color: black; bottom:30rem;">
      Nome do equipamento: ${marker.equipmentName}<br>
      Modelo: ${marker.equipmentModel}<br>
      Estado: ${marker.status}
      <br><br>
      <button onclick='viewHistory(${JSON.stringify(marker.equipmentModel)})' style="color:blue; top:30rem">Ver Histórico</button>
    </div>
  `;
    };
    const calculatePathCenter = (path: Path[]): Position => {
      if (path.length === 0) return center.value;

      const latitudes = path.map((p) => p.lat);
      const longitudes = path.map((p) => p.lng);

      const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
      const avgLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;

      return { lat: avgLat, lng: avgLng };
    };
    const viewHistory = (equipmentModel: string) => {
      router.push({
        name: "dataAnalysisWithModel",
        params: {
          model: equipmentModel,
        },
      });
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

    watch(
      () => props.path,
      (newPath) => {
        path.value = newPath.map((pos) => ({
          lat: pos.lat,
          lng: pos.lng,
        }));
        center.value = calculatePathCenter(path.value);
      },
      { immediate: true },
    );

    const polylineOptions = ref({
      strokeColor: "#FF0000",
      strokeWeight: 2,
    });

    return {
      center,
      markers,
      openInfoWindow,
      openedMarker,
      infoContent,
      polylineOptions,
    };
  },
});
</script>

<style lang="scss">
@use "../styles/settings.scss";
</style>
