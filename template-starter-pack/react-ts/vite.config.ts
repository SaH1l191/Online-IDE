import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,        // allows WebContainer to expose the port
    hmr: true,         // hot module replacement
  },
});