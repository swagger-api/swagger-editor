import { useMemo } from 'react';
import PropTypes from 'prop-types';

import ValidationTable from '../../../editor-monaco/components/ValidationTable/ValidationTable.jsx';

const ParseErrors = ({ errors, editorActions }) => {
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

  const handleValidationClick = (marker) => {
    editorActions.setJumpToEditorMarker(marker);
  };

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
      <ValidationTable
        columns={columns}
        data={errors}
        onValidationKeyClick={handleValidationClick}
      />
    </div>
  );
};

ParseErrors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.object).isRequired,
  editorActions: PropTypes.shape({
    setJumpToEditorMarker: PropTypes.func.isRequired,
  }).isRequired,
  editorPreviewAsyncAPISelectors: PropTypes.shape({
    selectParseErrors: PropTypes.func.isRequired,
  }).isRequired,
};

export default ParseErrors;
