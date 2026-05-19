import { dirname, relative } from 'path';

// output.paths produces root-relative paths (e.g. ./plugins/layout/index.js).
// Files nested under presets/ or plugins/ need paths relative to their own
// location. This plugin rewrites those imports after each chunk is rendered.

const ROOT_RELATIVE_IMPORT = /from "(\.\/(?:plugins|presets)\/[^"]+\.js)"/g;

const toRelative = (chunkDir, importPath) => {
  const rel = relative(chunkDir, importPath.slice(2)); // strip leading './'
  return `from "${rel.startsWith('.') ? rel : `./${rel}`}"`;
};

export const fixCrossChunkPaths = () => ({
  name: 'fix-cross-chunk-paths',
  renderChunk(code, chunk) {
    const chunkDir = dirname(chunk.fileName); // e.g. 'presets/monaco' or '.'
    if (chunkDir === '.') return null; // root-level files are already correct

    const result = code.replace(ROOT_RELATIVE_IMPORT, (_, importPath) =>
      toRelative(chunkDir, importPath)
    );
    return result !== code ? { code: result } : null;
  },
});
