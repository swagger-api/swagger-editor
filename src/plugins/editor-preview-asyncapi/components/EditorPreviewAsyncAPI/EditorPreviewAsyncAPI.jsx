import React, { Suspense, useEffect } from 'react';
import PropTypes from 'prop-types';
import '@asyncapi/react-component/styles/default.min.css';

const AsyncApiReactComponent = React.lazy(() =>
  import('@asyncapi/react-component/lib/esm/without-parser.js')
);

const Loading = () => <div>Loading...</div>;
const Parsing = () => <div>Parsing...</div>;

const EditorPreviewAsyncAPI = ({
  getComponent,
  editorPreviewAsyncAPIActions,
  editorPreviewAsyncAPISelectors,
}) => {
  const ParseErrors = getComponent('EditorPreviewAsyncAPIParseErrors', true);
  const isParseInProgress = editorPreviewAsyncAPISelectors.selectIsParseInProgress();
  const isParseSuccess = editorPreviewAsyncAPISelectors.selectIsParseSuccess();
  const isParseFailure = editorPreviewAsyncAPISelectors.selectIsParseFailure();
  const parseResult = editorPreviewAsyncAPISelectors.selectParseResult();
  const parseErrors = editorPreviewAsyncAPISelectors.selectParseErrors();
  const config = { show: { errors: true } };

  useEffect(() => {
    return () => {
      editorPreviewAsyncAPIActions.previewUnmounted();
    };
  }, [editorPreviewAsyncAPIActions]);

  return (
    <div className="swagger-editor__editor-preview-asyncapi">
      <Suspense fallback={<Loading />}>
        {isParseInProgress && <Parsing />}
        {isParseSuccess && <AsyncApiReactComponent schema={parseResult} config={config} />}
        {isParseFailure && <ParseErrors errors={parseErrors} />}
      </Suspense>
    </div>
  );
};

EditorPreviewAsyncAPI.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorPreviewAsyncAPIActions: PropTypes.shape({
    previewUnmounted: PropTypes.func.isRequired,
  }).isRequired,
  editorPreviewAsyncAPISelectors: PropTypes.shape({
    selectIsParseInProgress: PropTypes.func.isRequired,
    selectIsParseSuccess: PropTypes.func.isRequired,
    selectIsParseFailure: PropTypes.func.isRequired,
    selectParseResult: PropTypes.func.isRequired,
    selectParseErrors: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditorPreviewAsyncAPI;
