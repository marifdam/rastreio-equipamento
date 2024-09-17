<template>
  <Header></Header>
  <div class="tabs">
  <v-card theme="light">
    <v-tabs
      v-model="tab"
      align-tabs="center"
      class="tabs"
    >
      <v-tab :value="1">Histórico</v-tab>
      <v-tab :value="2">Informações</v-tab>
    </v-tabs>
  </v-card>
  <v-tabs-window v-model="tab" theme="ligth">
      <v-tabs-window-item
        :key="1"
        :value="1"
        theme="ligth"
      >
      <v-card theme="ligth">
        <Historico></Historico>          

      </v-card>

      </v-tabs-window-item>
    </v-tabs-window>
    <v-tabs-window v-model="tab" theme="ligth">
      <v-tabs-window-item
        :key="2"
        :value="2"
      >
      <v-card theme="ligth">
        <infoAdicionais></infoAdicionais>         

      </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
</div>
</template>

<script setup>
  import { ref } from 'vue'

  const tab = ref(null)
</script>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Header from "../components/headerMenu.vue";
import Historico from './historico.vue';
import infoAdicionais from './infoAdicionais'
import { data } from 'jquery';

export default defineComponent({
  components: { Header,Historico,infoAdicionais },
  setup() {
    onMounted(()=>{
      store.dispatch("populateFields");
    })

  },
});
</script>
<style lang="scss">
@use "../styles/settings.scss";
.container {
    display: flex;
    flex-direction: column;
    align-items: center; 
    padding: 2rem; 
  }
.tabs {
  background-color: #d3d3d3;

}
.v-window-item{
  .v-card{
    background-color: #F5F5F5	;
}
}

</style>