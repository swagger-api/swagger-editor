/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { useTable } from 'react-table';

import noop from '../../../utils/common-noop.js';

const ValidationTable = (props) => {
  const { columns, data, onValidationKeyClick } = props;
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });
  return (
    <table {...getTableProps()} className="validation-table">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td {...cell.getCellProps()}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        onValidationKeyClick(row.original);
                      }}
                      onKeyPress={() => {
                        onValidationKeyClick(row.original);
                      }}
                    >
                      {cell.render('Cell')}
                    </div>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

ValidationTable.propTypes = {
  onValidationKeyClick: PropTypes.func,
  columns: PropTypes.oneOfType([PropTypes.array]).isRequired,
  data: PropTypes.oneOfType([PropTypes.array]).isRequired,
};

ValidationTable.defaultProps = {
  onValidationKeyClick: noop,
};

export default ValidationTable;
