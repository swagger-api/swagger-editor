import React from 'react';
import PropTypes from 'prop-types';

import ValidationTable from '../../editor-monaco/components/ValidationTable/ValidationTable.jsx';

const AsyncAPIValidationPane = ({
  asyncapiSelectors,
  editorActions,
  onValidationClick,
  alwaysDisplayHeading,
}) => {
  const markers = asyncapiSelectors.selectAsyncApiParserMarkers();
  const columns = React.useMemo(
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
  const data = React.useMemo(() => markers, [markers]);
  const showTable = alwaysDisplayHeading || data.length > 0;

  const handleValidationClick = (marker) => {
    onValidationClick(marker);
    editorActions.setJumpToEditorMarker(marker);
  };

  return (
    <div className="swagger-editor__asyncapi-validation-pane">
      {showTable && (
        <>
          <h4>Invalid AsyncAPI document. Please fix errors:</h4>
          <ValidationTable
            columns={columns}
            data={data}
            onValidationKeyClick={handleValidationClick}
          />
        </>
      )}
    </div>
  );
};

AsyncAPIValidationPane.propTypes = {
  alwaysDisplayHeading: PropTypes.bool,
  editorActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  asyncapiSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  onValidationClick: PropTypes.func,
};

AsyncAPIValidationPane.defaultProps = {
  alwaysDisplayHeading: false,
  onValidationClick: () => {},
};

export default AsyncAPIValidationPane;
