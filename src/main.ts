import { registerPlugins } from "@/plugins";
import router from "./router";
import store from "./store/module";

// Components
import App from "./App.vue";
import VueGoogleMaps from "vue-google-maps-community-fork";

// Composables
import { createApp } from "vue";

const app = createApp(App);

registerPlugins(app);

app.use(store);
app
  .use(VueGoogleMaps, {
    load: {
      key: "AIzaSyAImfYSh550U8baKLO7B6JT3DD6662tUv0",
    },
  })
  .use(router)
  .mount("#app");
