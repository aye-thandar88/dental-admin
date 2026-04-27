import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path/win32";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  server: {
    strictPort: true,
    host: true,
    port: 3000,
  },
  preview: {
    port: 3000,
    host: true,
    strictPort: true,
    allowedHosts: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
