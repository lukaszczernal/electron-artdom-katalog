import path from "path";
import {
  configDefaults,
  defineConfig as defineTestConfig,
} from "vitest/config";

const testConfig = defineTestConfig({
  test: {
    ...configDefaults,
    alias: {
      "@": path.join(__dirname, "src"),
      styles: path.join(__dirname, "src/assets/styles"),
    },
  },
});

export default testConfig;
