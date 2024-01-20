import { createApp } from 'vue'
import App from './App.vue'
import PubSub from 'pubsub-js'
import Router from './router'
import axios from "axios";

import ElementPlus from 'element-plus'

const app = createApp(App)
app.use(Router)
app.use(ElementPlus, PubSub, axios, { size: 'small', zIndex: 3000 })
app.mount('#app')
