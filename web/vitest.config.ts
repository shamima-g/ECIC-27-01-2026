import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // Disable file parallelism for better test isolation with fake timers
    fileParallelism: false,
    // Configure fake timers to auto-advance for async operations
    fakeTimers: {
      shouldAdvanceTime: true,
    },
    include: [
      'src/**/__tests__/**/*.[jt]s?(x)',
      'src/**/?(*.)+(test).[jt]s?(x)',
    ],
    exclude: ['node_modules/', '**/*.spec.[jt]s'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.stories.{js,jsx,ts,tsx}',
        'src/**/__tests__/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
