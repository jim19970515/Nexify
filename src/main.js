import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import dayjs from 'dayjs'
import axios from 'axios'
import VueAxios from 'vue-axios'

const app = createApp(App)
app.use(dayjs,axios,VueAxios)
app.mount('#app')
