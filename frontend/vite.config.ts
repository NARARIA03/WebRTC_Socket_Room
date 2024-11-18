import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@apis", replacement: path.resolve(__dirname, "src/apis") },
      { find: "@hooks", replacement: path.resolve(__dirname, "src/hooks") },
      {
        find: "@components",
        replacement: path.resolve(__dirname, "src/components"),
      },
      { find: "@router", replacement: path.resolve(__dirname, "src/router") },
      { find: "@pages", replacement: path.resolve(__dirname, "src/pages") },
      { find: "@utils", replacement: path.resolve(__dirname, "src/utils") },
      { find: "@@types", replacement: path.resolve(__dirname, "src/types") },
    ],
  },
});
