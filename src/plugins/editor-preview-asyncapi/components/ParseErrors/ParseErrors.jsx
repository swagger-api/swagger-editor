import { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

const ParseErrors = ({ errors, editorActions, getComponent }) => {
  const columns = useMemo(
    () => [
      {
        Header: 'Line',
        accessor: 'startLineNumber',
      },
      {
        Header: 'Description',
        accessor: 'message',
      },
    ],
    []
  );

  const ValidationTable = getComponent('ValidationTable');

  const handleValidationClick = useCallback(
    (event, marker) => {
      const position = { lineNumber: marker.startLineNumber, column: marker.startColumn };
      editorActions.setPosition(position);
    },
    [editorActions]
  );

  return (
    <div className="swagger-editor__editor-preview-asyncapi-parse-errors">
      <div className="swagger-ui">
        <div className="version-pragma">
          <div className="version-pragma__message version-pragma__message--missing">
            <div>
              <h3>Invalid AsyncAPI definition.</h3>
              <p>Please fix following errors:</p>
            </div>
          </div>
        </div>
      </div>
      <ValidationTable columns={columns} data={errors} onRowClick={handleValidationClick} />
    </div>
  );
};

ParseErrors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  editorActions: PropTypes.shape({
    setPosition: PropTypes.func.isRequired,
  }).isRequired,
  editorPreviewAsyncAPISelectors: PropTypes.shape({
    selectParseErrors: PropTypes.func.isRequired,
  }).isRequired,
  getComponent: PropTypes.func.isRequired,
};

export default ParseErrors;
