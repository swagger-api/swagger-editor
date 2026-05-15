import { dirname, relative } from 'path';

// output.paths produces root-relative paths (e.g. ./plugins/layout/index.js).
// Files nested under presets/ or plugins/ need paths relative to their own
// location. This plugin rewrites those imports after each chunk is rendered.
export const fixCrossChunkPaths = () => ({
  name: 'fix-cross-chunk-paths',
  renderChunk(code, chunk) {
    const chunkDir = dirname(chunk.fileName); // e.g. 'presets/monaco' or '.'
    if (chunkDir === '.') return null; // root-level files already correct

    const result = code.replace(/from "(\.\/(?:plugins|presets)\/[^"]+\.js)"/g, (_, importPath) => {
      const bare = importPath.slice(2); // strip leading './'
      let rel = relative(chunkDir, bare);
      if (!rel.startsWith('.')) rel = `./${rel}`;
      return `from "${rel}"`;
    });
    return result !== code ? { code: result } : null;
  },
});
