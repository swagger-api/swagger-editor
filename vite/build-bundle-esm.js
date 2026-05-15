import { build } from 'vite';

import { mainConfig } from '../vite.config.esm.js';
import { apidomWorkerConfig, editorWorkerConfig } from './worker-configs.esm.js';

async function buildAll() {
  try {
    console.log('Building main ESM bundle...');
    await build(mainConfig);
    console.log('✓ Main ESM bundle complete');

    console.log('\nBuilding apidom worker...');
    await build(apidomWorkerConfig);
    console.log('✓ ApiDOM worker complete');

    console.log('\nBuilding editor worker...');
    await build(editorWorkerConfig);
    console.log('✓ Editor worker complete');

    console.log('\n✅ ESM build complete!');
  } catch (err) {
    console.error('❌ Build failed:', err);
    process.exit(1);
  }
}

buildAll();
