import { createApp } from 'vue'
import Vant from 'vant'
import 'vant/lib/index.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import './utils/rem.js'
createApp(App).use(createPinia()).use(router).use(Vant).mount('#app')
