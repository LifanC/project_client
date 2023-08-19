import { createApp } from 'vue'
import App from './App.vue'
import PubSub from 'pubsub-js'

import ElementPlus from 'element-plus'

const app = createApp(App)
app.mount('#app')
app.use(ElementPlus, PubSub, { size: 'small', zIndex: 3000 })
