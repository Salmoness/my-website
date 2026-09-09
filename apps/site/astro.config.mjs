import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      SITE_MODE: envField.enum({
        context: 'server',
        access: 'public',
        values: ['staging', 'production'],
        default: 'staging',
      }),
    },
  },
});
