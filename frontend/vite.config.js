import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: [
      'd7a6-2400-9800-bc4-4527-74c8-bc85-1fa3-9de8.ngrok-free.app',
      // bisa tambahkan host lain sesuai kebutuhan
    ],
  },
})
