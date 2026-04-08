import { registerPlugins } from '@/plugins';
import router from './router';
import store from './store/module';

// Components
import App from './App.vue';
import VueGoogleMaps from 'vue-google-maps-community-fork';

// Composables
import { createApp } from 'vue';

const app = createApp(App);

registerPlugins(app);

app.use(store);
app
  .use(VueGoogleMaps, {
    load: {
      key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }
  })
  .use(router)
  .mount('#app');
