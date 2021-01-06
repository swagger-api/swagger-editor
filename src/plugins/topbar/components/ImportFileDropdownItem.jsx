import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ImportFileDropdownItem extends Component {
  constructor(props) {
    super(props);
    this.onImportFileClick = this.onImportFileClick.bind(this);
  }

  onImportFileClick = async () => {
    // ref inline old method: onDocumentLoad
    const { topbarActions } = this.props;
    const importResult = await topbarActions.handleImportFile();
    if (importResult && importResult.error) {
      // display the error message
    }
  };

  render() {
    const { getComponent } = this.props;
    const DropdownItem = getComponent('DropdownItem');

    return <DropdownItem onClick={() => this.onImportFileClick()} name="Import File" />;
  }
}

ImportFileDropdownItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  topbarActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
