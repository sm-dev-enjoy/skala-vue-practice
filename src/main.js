import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { ElAlert, ElEmpty, ElInput, ElSkeleton } from 'element-plus'
import 'element-plus/es/components/alert/style/css'
import 'element-plus/es/components/empty/style/css'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/skeleton/style/css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('ElAlert', ElAlert)
app.component('ElEmpty', ElEmpty)
app.component('ElInput', ElInput)
app.component('ElSkeleton', ElSkeleton)

app.mount('#app')
