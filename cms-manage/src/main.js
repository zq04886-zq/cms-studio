import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import mitt from 'mitt'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import './styles/app.less'
import './styles/icon.less'
import './styles/legacy-icons.css'
const app = createApp(App)
document.documentElement.classList.add('dark')
const events = mitt()
app.config.globalProperties.eventBus = { $on: events.on, $off: events.off, $emit: events.emit }
app.use(createPinia()).use(router).use(ElementPlus, { locale: zhCn }).mount('#app')
