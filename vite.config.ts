import { build, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dts({ rollupTypes: true }), react()],

  server: {
    port: 7890,
    strictPort: true,
  },
  build: {
    lib: {
      entry: "src/herre/index.tsx",
      name: "herre",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "cancelable-promise", "crypto-js"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "cancelable-promise": "CancelablePromise",
          "crypto-js": "CryptoJS",
        },
      },
    },
  },
});
