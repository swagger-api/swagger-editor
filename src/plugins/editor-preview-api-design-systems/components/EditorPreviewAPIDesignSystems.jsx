import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const Parsing = () => <div>Parsing...</div>;

const EditorPreviewAPIDesignSystems = ({
  getComponent,
  editorPreviewADSActions,
  editorPreviewADSSelectors,
}) => {
  const Main = getComponent('ADSMain', true);
  const ParseErrors = getComponent('EditorPreviewAPIDesignSystemsParseErrors', true);
  const isParseInProgress = editorPreviewADSSelectors.selectIsParseInProgress();
  const isParseSuccess = editorPreviewADSSelectors.selectIsParseSuccess();
  const isParseFailure = editorPreviewADSSelectors.selectIsParseFailure();
  const parseError = editorPreviewADSSelectors.selectParseError();

  useEffect(() => {
    return () => {
      editorPreviewADSActions.previewUnmounted();
    };
  }, [editorPreviewADSActions]);

  return (
    <section className="swagger-editor__editor-preview-api-design-systems">
      {isParseInProgress && <Parsing />}
      {isParseSuccess && <Main />}
      {isParseFailure && <ParseErrors error={parseError} />}
    </section>
  );
};

EditorPreviewAPIDesignSystems.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorPreviewADSActions: PropTypes.shape({
    previewUnmounted: PropTypes.func.isRequired,
  }).isRequired,
  editorPreviewADSSelectors: PropTypes.shape({
    selectIsParseInProgress: PropTypes.func.isRequired,
    selectIsParseSuccess: PropTypes.func.isRequired,
    selectIsParseFailure: PropTypes.func.isRequired,
    selectParseResult: PropTypes.func.isRequired,
    selectParseError: PropTypes.func.isRequired,
    selectMainElement: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditorPreviewAPIDesignSystems;
