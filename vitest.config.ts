import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
        setupFiles: ['./tests/setup.ts'],
        testTimeout: 30000,
        // Tests que requieren DB real (integration): el tag 'integration'
        // se puede usar con --exclude o --include según necesidad.
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
})
