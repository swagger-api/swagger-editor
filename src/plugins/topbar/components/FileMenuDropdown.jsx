/* eslint-disable no-restricted-globals */
// This will be a React.Component container of dropdownItems
// no special list handling; all "clicks" pass props in same format
// If we need to later, we can migrate this file as a separate file,
// as define this index as a plugin wrapper
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

if (process.env.NODE_ENV !== 'test') {
  Modal.setAppElement('#root');
}

export default class FileMenuDropdown extends Component {
  constructor(props) {
    super(props);
    this.onImportUrlClick = this.onImportUrlClick.bind(this);
    this.onClearEditorClick = this.onClearEditorClick.bind(this);
    this.onSaveAsJsonClick = this.onSaveAsJsonClick.bind(this);
    this.onSaveAsYamlClick = this.onSaveAsYamlClick.bind(this);
    this.handleImportFromURL = this.handleImportFromURL.bind(this);
    this.onSubmitImportUrl = this.onSubmitImportUrl.bind(this);
    this.onImportUrlChange = this.onImportUrlChange.bind(this);
    this.closeModalClick = this.closeModalClick.bind(this);

    this.state = {
      showImportUrlModal: false,
      importUrlString: '',
      showErrorModal: false,
      errorMessage: '',
    };
  }

  closeModalClick = (showModalProperty) => () => {
    this.setState({ [showModalProperty]: false });
  };

  onImportUrlClick = async () => {
    // console.log('got a click for onImportUrlClick ');
    // ref old method: importFromURL
    // tests to implement (also equivalent topbarActions.importFromURL tests):
    // 1. user clicks on link, but then clicks on cancel prompt.
    // 2. user clicks on link, but inputs an invalid url; importedData.error exists && importedData.data does not exist
    // 3. user clicks on link, inputs valid url is valid; importedData.data exists && importedData.error does not exist
    // 4. user clicks on link, inputs valid url is valid; should not see a case where both importedData.data && importedData.error exists
    this.setState({
      showImportUrlModal: true,
      importUrlString: '',
    });
    // eslint-disable-next-line no-alert
    // const url = prompt('Enter the URL to import from:');
    // if (!url) {
    //   // user cancelled prompt
    //   return;
    // }
    // this.handleImportFromURL(url);
  };

  onImportUrlChange = (e) => {
    console.log('onImportUrlChange:', e.target.value);
    this.setState({
      importUrlString: e.target.value,
    });
  };

  onSubmitImportUrl = async () => {
    const { importUrlString } = this.state;
    // refactor: we should send importUrlString through a safety check
    if (importUrlString) {
      this.handleImportFromURL(importUrlString);
    }
    this.setState({
      showImportUrlModal: false,
    });
  };

  handleImportFromURL = async (url) => {
    const { topbarActions } = this.props;
    // dev note for copy/paste testing https://petstore.swagger.io/v2/swagger.json
    // another url: https://petstore3.swagger.io/api/v3/openapi.json
    const importedData = await topbarActions.importFromURL({ url });
    if (importedData && importedData.error) {
      console.log('we should open an error modal with text:', importedData.error);
      this.setState({
        showErrorModal: true,
        errorMessage: importedData.error,
      });
      return;
    }
    // eslint-disable-next-line no-console
    console.log('importedData generic success message:', importedData.data);
  };

  onClearEditorClick = async () => {
    // console.log('got a click for onClearEditorClick ');
    // ref old method: clearEditor
  };

  onSaveAsJsonClick = async () => {
    // console.log('got a click for onSaveAsJsonClick ');
    // ref old method: saveAsJson
    const { topbarActions } = this.props;
    const saveResult = await topbarActions.saveAsJson();
    if (saveResult && saveResult.error) {
      // display the error message
    }
  };

  onSaveAsYamlClick = async () => {
    // console.log('got a click for onSaveAsYamlClick ');
    // ref old method: saveAsYaml
    const { topbarActions } = this.props;
    let saveResult = await topbarActions.saveAsYaml({ overrideWarning: false });
    if (saveResult && saveResult.warning) {
      // display warning if user wants to continue
      // eslint-disable-next-line no-alert
      const allowOverride = confirm(saveResult.warning);
      if (allowOverride) {
        // try again, this time with override
        saveResult = await topbarActions.saveAsYaml({ overrideWarning: true });
      }
    }
    if (saveResult && saveResult.error) {
      // display the error message
    }
  };

  render() {
    const { getComponent, topbarActions } = this.props;
    const DropdownMenu = getComponent('DropdownMenu');
    const DropdownItem = getComponent('DropdownItem');
    const ImportFileDropdownItem = getComponent('ImportFileDropdownItem');

    const { showImportUrlModal, showErrorModal, errorMessage } = this.state;

    return (
      <div>
        <Modal isOpen={showImportUrlModal} contentLabel="Import URL">
          <h2>Enter the URL to import from</h2>
          <input
            type="text"
            className="form-control"
            placeholder="type url here"
            onChange={this.onImportUrlChange}
          />
          <button type="button" onClick={() => this.onSubmitImportUrl()}>
            submit
          </button>
        </Modal>
        <Modal isOpen={showErrorModal} contentLabel="Error Message">
          <h2>Uh oh, an error has occured</h2>
          {errorMessage}
          <button type="button" onClick={this.closeModalClick('showErrorModal')}>
            Close
          </button>
        </Modal>

        <DropdownMenu displayName="File">
          <DropdownItem onClick={() => this.onImportUrlClick()} name="Import URL" />
          <ImportFileDropdownItem getComponent={getComponent} topbarActions={topbarActions} />
          <li role="separator" />
          <DropdownItem onClick={() => this.onSaveAsJsonClick()} name="Save as JSON" />
          <DropdownItem onClick={() => this.onSaveAsYamlClick()} name="Save as YAML" />
          <DropdownItem onClick={() => this.onSaveAsJsonClick()} name="Convert and save as JSON" />
          <DropdownItem onClick={() => this.onSaveAsYamlClick()} name="Convert and save as YAML" />
          <li role="separator" />
          <DropdownItem onClick={() => this.onClearEditorClick()} name="Clear Editor" />
        </DropdownMenu>
      </div>
    );
  }
}

FileMenuDropdown.propTypes = {
  getComponent: PropTypes.func.isRequired,
  topbarActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
