import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['__tests__/integration/*.test.ts', '__tests__/unit/*.test.ts'],
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html']
    }
  }
})
