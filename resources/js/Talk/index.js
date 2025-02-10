import mingle, { createMingle } from '@mingle/mingleVue'
import Talk from './Talk.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()

createMingle('resources/js/Talk/index.js', ({createApp, props, el, wire, mingleId, wireId, mingleData}) => {
    const app = createApp(Talk, props)
    app.use(pinia)
    app.mount(el)
    return true
})

