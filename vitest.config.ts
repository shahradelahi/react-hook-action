import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    testTimeout: 10000,
    globals: true,
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
});
