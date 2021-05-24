import React from 'react';
import PropTypes from 'prop-types';

export default function ImportFileDropdownItem(props) {
  const onImportFileClick = async () => {
    // ref inline old method: onDocumentLoad
    const { topbarActions } = props;
    const importResult = await topbarActions.handleImportFile();
    if (importResult && importResult.error) {
      // display the error message
    }
  };
  const { getComponent } = props;
  const DropdownItem = getComponent('DropdownItem');

  return <DropdownItem onClick={() => onImportFileClick()} name="Import File" />;
}

ImportFileDropdownItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  topbarActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
