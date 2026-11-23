import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import { initSync } from './sync'
import { initContent } from './content'
import { initAccess } from './premium/access'
import './styles.css'

registerSW({ immediate: true })
initSync()
initContent()
initAccess()
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
