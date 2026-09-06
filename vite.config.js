import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/04_Apprende/', 
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Actualiza la app automáticamente si hay cambios
      devOptions: {
        enabled: true // Permite probar la PWA en modo desarrollo (npm run dev)
      },
      manifest: {
        name: 'Apprende',
        short_name: 'Apprende',
        description: 'Aplicación para practicar tests de oposiciones',
        theme_color: '#2563eb', // Color azul de tu app (Tailwind blue-600)
        background_color: '#ffffff',
        display: 'standalone', // Hace que se abra sin la barra de direcciones del navegador
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})

