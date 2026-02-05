import adapter from '@sveltejs/adapter-static';
import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';
import {readFileSync} from 'fs';
import {fileURLToPath} from 'url';

const file = fileURLToPath(new URL('../package.json', import.meta.url));
const pkg = JSON.parse(readFileSync(file, 'utf8'));

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
    version: {
      name: pkg.version
    }
  }
};

export default config;
