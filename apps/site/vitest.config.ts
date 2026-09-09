/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, 'node_modules/.astro/data-store.json');
const dest = path.resolve(__dirname, '.astro/data-store.json');

function syncDataStore() {
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

syncDataStore();

export default getViteConfig({
  plugins: [
    {
      name: 'sync-content-store-plugin',
      buildStart() {
        syncDataStore();
      },
    },
  ],
  test: {
    include: ['tests/**/*.test.ts'],
    css: true,
  },
});
