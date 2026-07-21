import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // ◄ ¡Esta es la línea clave que te faltaba!

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // ◄ ¡Aquí activamos el compilador de Tailwind v4!
  ],
})