import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: import.meta.env.VITE_BASE_PATH || "/vite-project",
  resolve: {
    alias: {
      //eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
