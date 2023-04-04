import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import ValidationTable from '../ValidationTable/ValidationTable.jsx';

const ValidationPane = ({
  editorSelectors,
  editorActions,
  alwaysDisplayHeading,
  onValidationClick,
}) => {
  const markers = editorSelectors.selectMarkers();
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
  const showTable = alwaysDisplayHeading || markers.length > 0;

  const handleValidationClick = useCallback(
    (event, marker) => {
      const position = { lineNumber: marker.startLineNumber, column: marker.startColumn };

      onValidationClick(marker);
      editorActions.setPosition(position);
    },
    [onValidationClick, editorActions]
  );

  return (
    <div className="swagger-editor__validation-pane">
      {showTable && (
        <ValidationTable columns={columns} data={markers} onRowClick={handleValidationClick} />
      )}
    </div>
  );
};

ValidationPane.propTypes = {
  alwaysDisplayHeading: PropTypes.bool,
  editorActions: PropTypes.shape({
    setPosition: PropTypes.func.isRequired,
  }).isRequired,
  editorSelectors: PropTypes.shape({
    selectMarkers: PropTypes.func.isRequired,
  }).isRequired,
  onValidationClick: PropTypes.func,
};

ValidationPane.defaultProps = {
  alwaysDisplayHeading: false,
  onValidationClick: () => {},
};

export default ValidationPane;
