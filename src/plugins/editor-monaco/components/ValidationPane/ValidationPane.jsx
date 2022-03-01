import React from 'react';
import PropTypes from 'prop-types';

import ValidationTable from '../ValidationTable/ValidationTable.jsx';

const ValidationPane = ({ editorSelectors, editorActions, onValidationClick }) => {
  const markers = editorSelectors.getEditorMarkers();
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
  const handleValidationClick = (marker) => {
    onValidationClick(marker);
    editorActions.setJumpToEditorMarker(marker);
  };

  return (
    <div className="validation-pane">
      <ValidationTable columns={columns} data={data} onValidationKeyClick={handleValidationClick} />
    </div>
  );
};

ValidationPane.propTypes = {
  editorActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  editorSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  onValidationClick: PropTypes.func,
};

ValidationPane.defaultProps = {
  onValidationClick: () => {},
};

export default ValidationPane;
