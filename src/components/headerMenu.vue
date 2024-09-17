<template>
  <div class="header">
    <v-app-bar :elevation="2" class="header" color="#363636">
      <template v-slot:prepend> </template>
      <v-btn @click="goToMain">Inicio </v-btn>

      <v-app-bar-title
        class="title"
        outlined="true"
        align="center"
        justify="center"
        >Rastreador de equipamentos</v-app-bar-title
      >
    </v-app-bar>
  </div>
</template>
<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const router = useRouter();
    const goToMain = () => {
      router.push({ name: "main" });
    };
    return {
      goToMain,
    };
  },
});
</script>
<style lang="scss">
.v-toolbar-title__placeholder {
  text-transform: uppercase;
  position: relative;
  left: -3rem;
}
</style>
