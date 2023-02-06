import React from 'react';
import PropTypes from 'prop-types';

import ValidationTable from '../ValidationTable/ValidationTable.jsx';

const ValidationPane = ({
  editorSelectors,
  editorActions,
  onValidationClick,
  alwaysDisplayHeading,
}) => {
  const markers = editorSelectors.selectMarkers();
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
    <div className="swagger-editor__validation-pane">
      {showTable && (
        <ValidationTable
          columns={columns}
          data={data}
          onValidationKeyClick={handleValidationClick}
        />
      )}
    </div>
  );
};

ValidationPane.propTypes = {
  alwaysDisplayHeading: PropTypes.bool,
  editorActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  editorSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  onValidationClick: PropTypes.func,
};

ValidationPane.defaultProps = {
  alwaysDisplayHeading: false,
  onValidationClick: () => {},
};

export default ValidationPane;
