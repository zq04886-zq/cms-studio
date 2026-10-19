import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
export default defineConfig({
 base: '/cms-manage/',
 plugins: [vue()],
 resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
 css: { preprocessorOptions: { less: { additionalData: '@import (reference) "@/styles/mixin.less";\n' } } },
 server: { host: '127.0.0.1', port: 3011, proxy: { '/atlas-cms': 'http://127.0.0.1:3300', '/uploads': 'http://127.0.0.1:3300' } },
 build: { target: 'es2022' }
})
