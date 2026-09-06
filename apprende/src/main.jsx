import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'
import { GoogleOAuthProvider } from '@react-oauth/google'

registerSW({ immediate: true })

// SUSTITUYE ESTE TEXTO por el tuyo (debe terminar en .apps.googleusercontent.com)
const CLIENT_ID = "548087407545-ts8c1h4b5tl4np0lmljgcu9bhcl98nrb.apps.googleusercontent.com"; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)