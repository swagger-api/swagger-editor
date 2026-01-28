import type { Plugin, ViteDevServer } from 'vite';
import { resolve } from 'path';

/**
 * Plugin to handle worker files in development mode
 *
 * In development, Vite automatically handles .js files but we need to ensure
 * workers at the root level (e.g., /apidom.worker.js) are properly resolved
 * and served with the correct MIME type.
 */
export const createDevWorkersPlugin = (): Plugin => {
  return {
    name: 'vite-plugin-dev-workers',
    apply: 'serve', // Only apply in dev mode
    enforce: 'pre', // Run before other plugins

    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url;

        // Only intercept worker requests at the root
        if (url === '/apidom.worker.js' || url === '/editor.worker.js') {
          let workerPath: string;

          if (url === '/apidom.worker.js') {
            workerPath = resolve(
              process.cwd(),
              'src/plugins/editor-monaco-language-apidom/language/apidom.worker.js'
            );
          } else {
            workerPath = resolve(
              process.cwd(),
              'node_modules/monaco-editor/esm/vs/editor/editor.worker.start.js'
            );
          }

          try {
            // Transform the worker file through Vite
            const result = await server.transformRequest(workerPath);

            if (result && result.code) {
              // Set proper headers BEFORE writing
              res.writeHead(200, {
                'Content-Type': 'application/javascript; charset=utf-8',
                'Content-Length': Buffer.byteLength(result.code),
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*',
              });
              res.end(result.code);
              return;
            } else {
              throw new Error('Failed to transform worker file');
            }
          } catch (error) {
            console.error(`Error serving ${url}:`, error);
            const errorCode = `console.error('Failed to load worker: ${error}');`;
            res.writeHead(500, {
              'Content-Type': 'application/javascript; charset=utf-8',
            });
            res.end(errorCode);
            return;
          }
        }

        // Not a worker request, continue
        next();
      });
    },
  };
};
