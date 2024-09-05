import { createApp } from 'vue'
import './style.css'
import router from './router'

import App from './App.vue'
console.log('env', process.env)
createApp(App).use(router).mount('#app')
