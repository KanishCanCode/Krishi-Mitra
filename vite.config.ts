import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/auth/": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/loan/": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/kyc/": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
