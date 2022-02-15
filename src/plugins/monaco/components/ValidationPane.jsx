/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

import ValidationTable from './ValidationTable.jsx';
import noop from '../../../utils/common-noop.js';

const ValidationPane = (props) => {
  const { editorSelectors, onValidationKeyClick } = props;

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

  return (
    <div className="validation-pane">
      <ValidationTable columns={columns} data={data} onValidationKeyClick={onValidationKeyClick} />
    </div>
  );
};

ValidationPane.propTypes = {
  onValidationKeyClick: PropTypes.func,
  editorSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

ValidationPane.defaultProps = {
  onValidationKeyClick: noop,
};

export default ValidationPane;
