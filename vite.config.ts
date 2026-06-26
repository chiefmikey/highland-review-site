// eslint-disable-next-line import-x/no-extraneous-dependencies -- build/test tooling is a devDep
import react from '@vitejs/plugin-react-swc';
// eslint-disable-next-line import-x/no-extraneous-dependencies -- build/test tooling is a devDep
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
