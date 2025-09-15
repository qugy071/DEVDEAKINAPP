// client/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Put `server` INSIDE the config object
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8787", // your Express server
        changeOrigin: true,
        // rewrite: (p) => p.replace(/^\/api/, "/api"), // not needed; keep as is
      },
    },
  },
});
