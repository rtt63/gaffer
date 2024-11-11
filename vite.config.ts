import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "[name].[hash].js",
        chunkFileNames: "[name].[hash].js",
        assetFileNames: "[name].[hash][extname]",
      },
      cache: false, // Отключение кэша Rollup
    },
    cssCodeSplit: true, // для правильного хэширования стилей
    outDir: "dist", // указать явно директорию для сборки
    emptyOutDir: true, // очищать директорию перед каждой сборкой
  },
});
