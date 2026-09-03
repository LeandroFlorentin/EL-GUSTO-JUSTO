import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    env: {
      NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER: '5491100000000',
    },
    setupFiles: ['./vitest.setup.ts'],
  },
});
