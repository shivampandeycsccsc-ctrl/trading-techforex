import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    // ← ये दो लाइनें जोड़ीं गईं: output format और chunk warning limit
    rollupOptions: {
      output: {
        format: "es" // force ESM output so `import.meta` works
      }
    },
    chunkSizeWarningLimit: 2000 // (kB) अपनी जरूरत के हिसाब से बढ़ा/घटा लो
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
