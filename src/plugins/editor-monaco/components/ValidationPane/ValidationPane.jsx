import React from 'react';
import PropTypes from 'prop-types';

import ValidationTable from '../ValidationTable/ValidationTable.jsx';

const ValidationPane = ({
  editorSelectors,
  editorActions,
  onValidationClick,
  alwaysDisplayHeading,
}) => {
  const markers = editorSelectors.selectEditorMarkers();
  const columns = React.useMemo(
    () => [
      {
        Header: 'Line', // Type, Line, Description
        accessor: 'startLineNumber',
      },
      {
        Header: 'Description',
        accessor: 'message',
      },
      // {
      //   Header: 'Type',
      //   assessor: 'todo: tbd',
      // },
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
    <div className="validation-pane">
      {!showTable ? null : (
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
