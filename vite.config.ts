import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig({
  base: "/mozaic-ize",

  plugins: [
    tailwindcss(),
    react(),
    checker({typescript: true}),
  ],
})
