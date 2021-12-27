import React from 'react';
import PropTypes from 'prop-types';

const ImportFileDropdownItem = (props) => {
  const handleImportFileClick = async () => {
    const { topbarActions } = props;
    const importResult = await topbarActions.importFile();
    if (importResult && importResult.error) {
      // may display the error message
    }
  };
  const { getComponent } = props;
  const DropdownItem = getComponent('DropdownItem');

  return <DropdownItem onClick={() => handleImportFileClick()} name="Import File" />;
};

ImportFileDropdownItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  topbarActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default ImportFileDropdownItem;
