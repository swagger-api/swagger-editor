import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

const ValidationPane = ({
  editorSelectors,
  editorActions,
  getComponent,
  alwaysDisplayHeading = false,
  onValidationClick = () => {},
}) => {
  const markers = editorSelectors.selectMarkers();
  const ValidationTable = getComponent('ValidationTable');
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
      {showTable && <ValidationTable data={markers} onRowClick={handleValidationClick} />}
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
  getComponent: PropTypes.func.isRequired,
  onValidationClick: PropTypes.func,
};

export default ValidationPane;
