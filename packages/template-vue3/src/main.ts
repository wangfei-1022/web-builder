import { Drawer, Modal } from '@arco-design/web-vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(pinia);
app.mount('#app');

Modal._context = app._context;
Drawer._context = app._context;