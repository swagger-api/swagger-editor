import type { Plugin } from 'vite';
import { resolve as resolvePath } from 'path';
import { existsSync } from 'fs';

/**
 * Plugin to resolve Monaco VSCode API internal imports
 *
 * The @codingame/monaco-vscode-api and related packages have imports like:
 * "@codingame/monaco-vscode-api/vscode/vs/base/browser/cssValue"
 *
 * But the actual files are at:
 * "@codingame/monaco-vscode-api/vscode/src/vs/base/browser/cssValue.js"
 *
 * This plugin intercepts these imports and adds the missing 'src' directory.
 */
export const createMonacoResolverPlugin = (): Plugin => {
  return {
    name: 'vite-plugin-monaco-resolver',
    enforce: 'pre',

    async resolveId(id, importer, options) {
      // Handle imports from monaco-vscode-api that are missing 'src'
      const monacoApiPattern = /^@codingame\/monaco-vscode-api\/vscode\/vs\/(.*)$/;
      const match = id.match(monacoApiPattern);

      if (match) {
        // Construct the corrected path
        const relativePath = match[1];
        const baseDir = resolvePath(process.cwd(), 'node_modules/@codingame/monaco-vscode-api/vscode/src/vs');

        // Try with different extensions
        const extensions = ['.js', '.ts', '.d.ts', ''];
        for (const ext of extensions) {
          const fullPath = resolvePath(baseDir, relativePath + ext);
          if (existsSync(fullPath)) {
            return fullPath;
          }
        }

        // If not found, try to resolve through Vite's resolver
        const newId = `@codingame/monaco-vscode-api/vscode/src/vs/${relativePath}`;
        const resolved = await this.resolve(newId, importer, { skipSelf: true, ...options });
        if (resolved) {
          return resolved;
        }
      }

      return null; // Let other plugins/default resolution handle it
    },
  };
};
