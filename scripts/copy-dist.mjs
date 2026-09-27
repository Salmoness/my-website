// Copies the built site to ./dist so hosts that expect the output at the repository root
// (for example Hostinger's Astro preset) find it without a custom output directory.
import { cpSync, existsSync, rmSync } from 'node:fs';

const source = 'apps/site/dist';
const target = 'dist';

if (!existsSync(source)) {
  console.error(`copy-dist: ${source} not found. Did the site build run?`);
  process.exit(1);
}

rmSync(target, { recursive: true, force: true });
cpSync(source, target, { recursive: true });
console.log(`copy-dist: copied ${source} to ${target}`);
