<template>
  <GMapMap
    :center="center"
    :zoom="7"
    map-type-id="terrain"
    style="width: 500px; height: 300px"
  >
    <GMapCluster>
      <GMapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="center = m.position"
      />
    </GMapCluster>
  </GMapMap>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';

interface Position {
  lat: number;
  lng: number;
}

export default defineComponent({
  props: {
    position: {
      type: Object as () => Position,
      default: () => ({
        lat: 0,
        lng: 0,
      }),
    },
  },
  setup(props) {
    const store = useStore();

    // Define o tipo para center e markers
    const center = ref<Position>({ lat: 51.093048, lng: 6.842120 });
    const markers = ref<{ position: Position }[]>([{ position: props.position }]);

    // Observa mudanças na prop `position` para atualizar os marcadores
    watch(
      () => props.position,
      (newPosition) => {
        markers.value = [{ position: newPosition }];
        center.value = newPosition; // Atualiza o centro do mapa
      },
      { immediate: true } // Garante que o watcher execute também na montagem inicial
    );

    return {
      center,
      markers,
    };
  },
});
</script>
