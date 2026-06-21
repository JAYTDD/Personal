import './assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { addCollection } from '@iconify/vue'
import lucideIcons from '@iconify-json/lucide/icons.json'
import simpleIconsIcons from '@iconify-json/simple-icons/icons.json'

import App from './App.vue'
import router from './router'

// Register iconify data locally — eliminates ~29 remote API calls per page load.
// addCollection reuses the same registry instance, so registering twice is safe.
addCollection(lucideIcons as Parameters<typeof addCollection>[0])
addCollection(simpleIconsIcons as Parameters<typeof addCollection>[0])

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
