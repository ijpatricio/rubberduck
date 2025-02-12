import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    server: {
        port: 5199,
    },
    resolve: {
        alias: {
            "@mingle": path.resolve(__dirname, "/vendor/ijpatricio/mingle/resources/js"),
        },
    },
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/PromptEditor/index.js',
                'resources/js/Talk/index.js',
            ],
            refresh: true,
        }),
        react(),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        tailwindcss(),
    ],
});
