import { createApp } from 'vue'
import './style.scss'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-notification.css'
import router from './router'
import { createPinia } from 'pinia'
import i18n from '@/language'
import ElementPlus from 'element-plus'
import locale from 'element-plus/es/locale/lang/zh-cn'
import { setupDirectives } from './directives'

import App from './App.vue'
const pinia = createPinia()
const app = createApp(App)
setupDirectives(app)
app.use(i18n)
app.use(ElementPlus, { locale })
app.use(pinia).use(router).mount('#app')
