import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  server: {
    port: 6673,
    host: true
  },
  preview: {
    port: 6673,
    host: true
  },
  base: '/',
  site: 'http://localhost:6673'
});