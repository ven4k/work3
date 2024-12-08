import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/router";
import "normalize.css";
import Notifications from "./Notification/Notification.vue";
import { createStore } from "vuex";
import clientJSON from './mock-data/clients.json'
import serviceJSON from './mock-data/service.json'
import catalogJSON from './mock-data/catalog.json'

const store = createStore({
  state: {
    clients: JSON.parse(sessionStorage.getItem('clients')) || clientJSON,
    service: JSON.parse(sessionStorage.getItem('service')) || serviceJSON,
    catalog: JSON.parse(sessionStorage.getItem('catalog')) || catalogJSON,
    managerApplicationData: JSON.parse(sessionStorage.getItem('managerApplications')) || []
  },
  mutations: {
    updateClients(state, payload) {
      state.clients = payload;
    },
    updateService(state, payload) {
      state.service = payload
    },
    updateCatalog(state, payload) {
      state.catalog = payload
    },
    updateManagerApplicationData(state, payload) {
      state.managerApplicationData = payload
    }
  },
});
const app = createApp(App);
app.use(router);
app.use(store);
app.component(Notifications);
app.mount("#app");
