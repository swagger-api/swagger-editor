import * as monaco from 'monaco-editor';
import { StandaloneServices, IStorageService } from 'vscode/services';
/**
 * This is quick fix for displaying command palette.
 *
 * {@link https://github.com/CodinGame/monaco-vscode-api/issues/267}
 * @TODO(vladimir.gorej@gmail.com): this can be removed with next VSCode API release.
 */
import 'vscode/vscode/vs/workbench/browser/workbench.contribution';

import goToSymbolActionDescriptor from './actions/go-to-symbol.js';

const lazyMonacoContribution = () => {
  const disposables = [];

  StandaloneServices.get(IStorageService).store('expandSuggestionDocs', true, 0, 0);

  // setup custom actions
  disposables.push(
    monaco.editor.onDidCreateEditor((editor) => {
      disposables.push(
        monaco.editor.onDidCreateModel(() => {
          if (!editor.getAction(goToSymbolActionDescriptor.id)) {
            disposables.push(editor.addAction(goToSymbolActionDescriptor));
          }
        })
      );
    })
  );

  // disposing of all allocated disposables
  disposables.push(
    monaco.editor.onDidCreateEditor((editor) => {
      disposables.push(
        editor.onDidDispose(() => {
          disposables.forEach((disposable) => disposable.dispose());
          disposables.length = 0;
        })
      );
    })
  );
};

export default lazyMonacoContribution;
