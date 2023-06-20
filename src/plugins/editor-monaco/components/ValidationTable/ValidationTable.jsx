import React from 'react';
import PropTypes from 'prop-types';

import SeverityIcon from './SeverityIcon.jsx';

const ValidationTable = ({ data, onRowClick }) => {
  return (
    <table role="table" className="swagger-editor__validation-table">
      <thead>
        <tr>
          <th role="columnheader">Severity</th>
          <th role="columnheader">Line</th>
          <th role="columnheader">Code</th>
          <th role="columnheader">Message</th>
        </tr>
      </thead>
      <tbody>
        {data.map((marker, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <tr key={index} role="row button" onClick={(event) => onRowClick(event, marker)}>
            <td role="cell">
              <SeverityIcon severity={marker.severity} />
            </td>
            <td role="cell">{marker.startLineNumber}</td>
            <td role="cell">{marker.code}</td>
            <td role="cell">{marker.message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

ValidationTable.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array]).isRequired,
  onRowClick: PropTypes.func.isRequired,
};

export default ValidationTable;
