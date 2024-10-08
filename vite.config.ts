import { sentryVitePlugin } from '@sentry/vite-plugin'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        sentryVitePlugin({
            org: 'spiritecosse',
            project: 'faithfishart-admin',
        }),
    ],

    define: {
        'process.env': process.env,
    },

    server: {
        host: true,
        port: 5176,
    },

    base: '/',

    build: {
        sourcemap: true,
    },
})
