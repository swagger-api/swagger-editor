import React, { Suspense, useMemo, useEffect, FC } from 'react';
import type { AsyncAPIDocumentInterface } from '@asyncapi/parser/esm/models';
import type { Diagnostic } from '@asyncapi/parser';

type GetComponent = (name: string) => FC<Record<string, unknown>>;

interface EditorPreviewAsyncAPIActions {
  previewUnmounted: () => void;
}

interface EditorPreviewAsyncAPISelectors {
  selectIsParseInProgress: () => boolean;
  selectIsParseSuccess: () => boolean;
  selectIsParseFailure: () => boolean;
  selectParseResult: () => AsyncAPIDocumentInterface | null;
  selectParseErrors: () => Diagnostic[];
}

interface Props {
  getComponent: GetComponent;
  editorPreviewAsyncAPIActions: EditorPreviewAsyncAPIActions;
  editorPreviewAsyncAPISelectors: EditorPreviewAsyncAPISelectors;
}

const Loading: FC = () => <div>Loading...</div>;

const EditorPreviewAsyncAPI: FC<Props> = ({
  getComponent,
  editorPreviewAsyncAPIActions,
  editorPreviewAsyncAPISelectors,
}) => {
  const ParseErrors = getComponent('EditorPreviewAsyncAPIParseErrors');
  const AsyncAPIReactComponent = getComponent('EditorPreviewAsyncAPIReactComponent');

  const isParseInProgress = editorPreviewAsyncAPISelectors.selectIsParseInProgress();
  const isParseSuccess = editorPreviewAsyncAPISelectors.selectIsParseSuccess();
  const isParseFailure = editorPreviewAsyncAPISelectors.selectIsParseFailure();
  const parseResult = editorPreviewAsyncAPISelectors.selectParseResult();
  const parseErrors = editorPreviewAsyncAPISelectors.selectParseErrors();
  const config = useMemo(() => ({ show: { errors: true } }), []);

  useEffect(() => {
    return () => {
      editorPreviewAsyncAPIActions.previewUnmounted();
    };
  }, [editorPreviewAsyncAPIActions]);

  // During re-parse, parseStatus=PARSING but parseResult/parseErrors retain their previous
  // values (parseStartedReducer does not clear them). Use the state values directly to keep
  // the previous render visible during re-parse without flashing blank content.
  const showSuccess = isParseSuccess || parseResult !== null;
  const showFailure = !showSuccess && (isParseFailure || parseErrors.length > 0);

  return (
    <div className="swagger-editor__editor-preview-asyncapi">
      <Suspense fallback={<Loading />}>
        {isParseInProgress && !showSuccess && !showFailure && <Loading />}
        {showSuccess && <AsyncAPIReactComponent schema={parseResult as unknown} config={config} />}
        {showFailure && <ParseErrors errors={parseErrors as unknown} />}
      </Suspense>
    </div>
  );
};

export default EditorPreviewAsyncAPI;
