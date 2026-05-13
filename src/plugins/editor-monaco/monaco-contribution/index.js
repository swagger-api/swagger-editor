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
      const setModelVersions = (model) => {
        const versionId = model.getVersionId();
        const alternativeVersionId = model.getAlternativeVersionId();

        editorActions.setModelVersionId(versionId, { alternativeVersionId });
      };

      disposables.push(
        monaco.editor.onDidCreateModel((model) => {
          setModelVersions(model);
        })
      );

      disposables.push(
        editor.onDidChangeModelContent((event) => {
          if (event.isUndoing || event.isRedoing) {
            // wait for the model to update alternative version ID before storing it in the state
            queueMicrotask(() => {
              const model = editor.getModel();
              setModelVersions(model);
            });
            return;
          }

          setModelVersions(editor.getModel());
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
