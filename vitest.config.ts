import {
  configDefaults,
  defineConfig as defineTestConfig,
} from "vitest/config";

const testConfig = defineTestConfig({
  test: configDefaults,
});

export default testConfig;
