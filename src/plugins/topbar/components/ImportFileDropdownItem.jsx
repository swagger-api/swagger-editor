import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ImportFileDropdownItem extends Component {
  constructor(props) {
    super(props);
    this.onImportFileClick = this.onImportFileClick.bind(this);
  }

  onImportFileClick = async () => {
    // console.log('got a click for onImportFileClick ');
    // ref inline old method: onDocumentLoad
    const { topbarActions } = this.props;
    // eslint-disable-next-line no-unused-vars
    const result = await topbarActions.handleImportFile();
    // console.log('result:', result);
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
