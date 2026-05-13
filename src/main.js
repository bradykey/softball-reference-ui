import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store/store';
import vuetify from './plugins/vuetify';

createApp(App).use(router).use(store).use(vuetify).mount('#app');
