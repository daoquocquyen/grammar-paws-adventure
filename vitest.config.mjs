import { defineConfig } from "vitest/config";

export default defineConfig({
    esbuild: {
        loader: "jsx",
        jsx: "automatic",
        include: /.*\.[jt]sx?$/,
        exclude: [],
    },
    test: {
        environment: "jsdom",
        setupFiles: ["./tests/setup.js"],
        include: ["tests/unit/**/*.test.js", "tests/unit/**/*.test.jsx", "tests/integration/**/*.test.jsx"],
    },
});
