import { createRouter, createWebHistory } from 'vue-router';
import mainMenu from '../components/mainMenu.vue';
import trackingMachine from '../components/trackingMachine.vue';
import dataAnalysis from '../components/dataAnalysis.vue';

const routes = [
  { name: 'main', path: '/', component: mainMenu },
  { name: 'tracking', path: '/tracking', component: trackingMachine },
  { name: 'dataAnalysis', path: '/dataAnalysis', component: dataAnalysis },
  {
    name: 'dataAnalysisWithModel',
    path: '/dataAnalysis/:model',
    component: dataAnalysis
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
