import * as monaco from 'monaco-editor';
import { StandaloneServices, IStorageService } from '@codingame/monaco-vscode-api/services';

import goToSymbolActionDescriptor from './actions/go-to-symbol.js';

const lazyMonacoContribution = ({ system }) => {
  const { monacoInitializationDeferred, editorActions } = system;
  const disposables = [];

  monacoInitializationDeferred().promise.then(() => {
    StandaloneServices.get(IStorageService).store('expandSuggestionDocs', true, 0, 0);
  });

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

  // store current version ID of the model
  disposables.push(
    monaco.editor.onDidCreateEditor((editor) => {
      disposables.push(
        monaco.editor.onDidCreateModel((model) => {
          const versionId = model.getVersionId();
          const alternativeVersionId = model.getAlternativeVersionId();

          editorActions.setModelVersionId(versionId, { alternativeVersionId });
        })
      );

      disposables.push(
        editor.onDidChangeModelContent(() => {
          const model = editor.getModel();
          const versionId = model.getVersionId();
          const alternativeVersionId = model.getAlternativeVersionId();

          editorActions.setModelVersionId(versionId, { alternativeVersionId });
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
