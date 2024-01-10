import { build, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dts({ rollupTypes: true }), react()],

  server: {
    port: 7890,
    strictPort: false,
  },
  build: {
    lib: {
      entry: "src/herre/index.tsx",
      name: "herre",
      fileName: "herre"
    },
    rollupOptions: {
      external: ["react", "react-dom", "crypto-js"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "crypto-js": "CryptoJS",
        },
      },
    },
  },
});
