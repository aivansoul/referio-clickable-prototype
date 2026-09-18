import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import { HashRouter } from 'react-router-dom'
import '@fontsource/archivo/800.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import App from './App'
import './styles.css'
import './client-reference-corrections.css'
import './business-fidelity.css'
import './gateway.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <HashRouter>
        <App />
      </HashRouter>
    </MotionConfig>
  </StrictMode>,
)
