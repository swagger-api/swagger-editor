import { build } from 'vite';
import { mainConfig, apidomWorkerConfig, editorWorkerConfig } from '../vite.config.umd.js';

async function buildAll() {
  try {
    console.log('Building main UMD bundle...');
    await build(mainConfig);
    console.log('✓ Main UMD bundle complete');

    console.log('\nBuilding apidom worker...');
    await build(apidomWorkerConfig);
    console.log('✓ ApiDOM worker complete');

    console.log('\nBuilding editor worker...');
    await build(editorWorkerConfig);
    console.log('✓ Editor worker complete');

    console.log('\n✅ UMD build complete!');
  } catch (err) {
    console.error('❌ Build failed:', err);
    process.exit(1);
  }
}

buildAll();
