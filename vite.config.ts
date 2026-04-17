import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "node22",
    lib: {
      entry: "src/index.tsx",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "ink"],
    },
  },
});
