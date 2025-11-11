import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/uploads": { 
        target: "https://campusnav-backend.onrender.com", 
        changeOrigin: true 
      },
      "/api": {
        target: "https://campusnav-backend.onrender.com",
        changeOrigin: true
      }
    }
  }
});
