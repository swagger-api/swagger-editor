// This is a React.Component container of dropdownItems
// no special list handling; all "clicks" pass props in same format
// If we need to later, we can migrate this file as a separate file,
// and define this index as a plugin wrapper
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

if (process.env.NODE_ENV !== 'test') {
  Modal.setAppElement('#root');
}

export default class FileMenuDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showImportUrlModal: false,
      importUrlString: '',
      showErrorModal: false,
      errorMessage: '',
      showConfirmModal: false,
      confirmMessage: '',
    };
  }

  closeModalClick = (showModalProperty) => () => {
    this.setState({ [showModalProperty]: false });
  };

  onImportUrlClick = async () => {
    // ref legacy method: importFromURL
    this.setState({
      showImportUrlModal: true,
      importUrlString: '',
    });
  };

  onImportUrlChange = (e) => {
    this.setState({
      importUrlString: e.target.value,
    });
  };

  onSubmitImportUrl = async () => {
    const { importUrlString } = this.state;
    // todo refactor: we should send importUrlString through a safety check
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
      // show error message
      this.setState({
        showErrorModal: true,
        errorMessage: importedData.error,
      });
    }
  };

  onClearEditorClick = async () => {
    // console.log('got a click for onClearEditorClick ');
    // ref legacy method: clearEditor
  };

  onSaveAsJsonClick = async () => {
    // ref legacy method: saveAsJson
    const { topbarActions } = this.props;
    const saveResult = await topbarActions.saveAsJson();
    if (saveResult && saveResult.error) {
      // display the error message
      this.setState({
        showErrorModal: true,
        errorMessage: saveResult.error,
      });
    }
  };

  onSaveAsYamlClick = async () => {
    // ref legacy method: saveAsYaml
    const { topbarActions } = this.props;
    const saveResult = await topbarActions.saveAsYaml({ overrideWarning: false });
    if (saveResult && saveResult.warning) {
      // display warning if user wants to continue
      this.setState({
        showConfirmModal: true,
        confirmMessage: saveResult.warning,
      });
    }
    if (saveResult && saveResult.error) {
      // display the error message
      this.setState({
        showErrorModal: true,
        errorMessage: saveResult.error,
      });
    }
  };

  onSaveAsYamlWithOverride = async () => {
    const { topbarActions } = this.props;
    const saveResult = await topbarActions.saveAsYaml({ overrideWarning: true });
    if (saveResult && saveResult.error) {
      // display the error message
      this.setState({
        showErrorModal: true,
        errorMessage: saveResult.error,
      });
      return;
    }
    this.setState({
      showConfirmModal: false,
      confirmMessage: '',
    });
  };

  render() {
    const { getComponent, topbarActions } = this.props;
    const DropdownMenu = getComponent('DropdownMenu');
    const DropdownItem = getComponent('DropdownItem');
    const ImportFileDropdownItem = getComponent('ImportFileDropdownItem');

    const {
      showImportUrlModal,
      showErrorModal,
      errorMessage,
      showConfirmModal,
      confirmMessage,
    } = this.state;

    return (
      <div>
        <Modal
          isOpen={showImportUrlModal}
          closeTimeoutMS={200}
          contentLabel="Import URL"
          className="mymodal"
          overlayClassName="myoverlay"
        >
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">Enter the URL to import from</div>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                placeholder="type url here"
                onChange={this.onImportUrlChange}
              />
            </div>
            <div className="modal-footer">
              <button type="button" onClick={() => this.onSubmitImportUrl()}>
                submit
              </button>
              <button type="button" onClick={this.closeModalClick('showImportUrlModal')}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
        <Modal isOpen={showErrorModal} contentLabel="Error Message">
          <h2>Uh oh, an error has occured</h2>
          {errorMessage}
          <button type="button" onClick={this.closeModalClick('showErrorModal')}>
            Close
          </button>
        </Modal>
        <Modal isOpen={showConfirmModal} contentLabel="Confirm">
          <h2>Are you sure?</h2>
          {confirmMessage}
          <button type="button" onClick={() => this.onSaveAsYamlWithOverride()}>
            Yes
          </button>
          <button type="button" onClick={this.closeModalClick('showConfirmModal')}>
            Cancel
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
