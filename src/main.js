import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

import Particles from 'particles.vue3'
const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.use(Particles)
app.mount('#app')
