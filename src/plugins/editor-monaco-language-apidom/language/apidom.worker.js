import { start } from 'monaco-editor/esm/vs/editor/editor.worker.start.js';

import { makeCreate, ApiDOMWorker } from './ApiDOMWorker.js';

const create = makeCreate(ApiDOMWorker);

/*
 * SPDX-SnippetBegin
 * SPDX-License-Identifier: MIT
 * SPDX-SnippetCopyrightText: Copyright (c) 2022 CodinGame
 *
 * Copy of previous workaround removed in
 * https://github.com/CodinGame/monaco-vscode-api/commit/d3fcbe903edf7151d4ca67467465a4fbb305747c
 * TODO: Investigate and remove if possible during the next @codingame/monaco-vscode-api dependency update
 */
const initialize = () => {
  start((context) => {
    let requestHandler;
    return new Proxy(
      {},
      {
        get(_target, propKey) {
          if (propKey === '$initialize') {
            return async (data) => {
              if (!requestHandler) {
                requestHandler = create(context, data);
              }
            };
          }
          const value = requestHandler?.[propKey];

          if (typeof value === 'function') {
            return value.bind(requestHandler);
          }
          return value;
        },
      }
    );
  });
};
// SPDX-SnippetEnd

globalThis.onmessage = () => {
  initialize((ctx, createData) => {
    return create(ctx, createData);
  });
};

export { initialize, create, makeCreate, ApiDOMWorker };
