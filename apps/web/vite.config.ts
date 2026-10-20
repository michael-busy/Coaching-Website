import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 5180,
    // `pnpm dev` runs the Worker (wrangler dev) on 8787 next to Vite.
    proxy: {
      "/api": "http://localhost:8787",
    },
  },
});
