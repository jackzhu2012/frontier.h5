import { createApp, Directive } from 'vue'
import App from './App.vue'

import * as directives from '@/directives'
import router from './router'
import { store } from './store'
import { loadAllPlugins } from './plugins'

import '@/styles/index.scss'
import 'normalize.css'
import '@/permission'

const app = createApp(App)

loadAllPlugins(app)

Object.keys(directives).forEach(key => {
    app.directive(key, (directives as { [key: string]: Directive })[key])
})

app.use(store).use(router).mount('#app')
