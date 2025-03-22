import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React and related packages into a vendor chunk
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // Split crypto-related dependencies
          "vendor-crypto": ["openpgp"],
        },
      },
    },
    // Increase the warning limit to reduce noise (optional)
    chunkSizeWarningLimit: 800,
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
