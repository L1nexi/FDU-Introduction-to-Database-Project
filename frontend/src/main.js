import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElememtPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueAxios from 'vue-axios'
import axios from 'axios'
import store from './store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
app.use(ElememtPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(store)
app.use(router)
app.use(VueAxios, axios)
axios.defaults.baseURL = 'http://localhost:8000/'
app.mount('#app')
