import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // Configura '@' para apuntar a la carpeta 'src'
            '@': resolve(__dirname, 'src'),
        },
    },
});