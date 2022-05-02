import React from 'react';
import PropTypes from 'prop-types';

const ImportFileDropdownItem = ({ getComponent, topbarActions }) => {
  const handleImportFileClick = async () => {
    const importResult = await topbarActions.importFile();
    if (importResult && importResult.error) {
      // may display the error message
    }
  };
  const DropdownItem = getComponent('DropdownItem');

  return <DropdownItem onClick={() => handleImportFileClick()} name="Import File" />;
};

ImportFileDropdownItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  topbarActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default ImportFileDropdownItem;
