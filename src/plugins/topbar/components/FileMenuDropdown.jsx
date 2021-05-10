// This is a React.Component container of dropdownItems
// no special list handling; all "clicks" pass props in same format
// If we need to later, we can migrate this file as a separate file,
// and define this index as a plugin wrapper
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import ModalInputWrapper from './ModalInputWrapper';
import ImportUrl from './ImportUrl';

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
    // comment out above, use this to test warning
    // this.setState({
    //   showConfirmModal: true,
    //   confirmMessage: 'saveResult.warning lorem ipsum',
    // });
    // comment out above, use this to test error
    // this.setState({
    //   showErrorModal: true,
    //   errorMessage: 'saveResult.error lorem ipsum',
    // });
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
        <ModalInputWrapper
          isOpen={showImportUrlModal}
          contentLabel="Import URL"
          modalTitle="Import URL"
          closeModalClick={this.closeModalClick('showImportUrlModal')}
          cancelModalClick={this.closeModalClick('showImportUrlModal')}
          submitModalClick={() => this.onSubmitImportUrl()}
          modalBodyContent={<ImportUrl onImportUrlChange={this.onImportUrlChange} />}
        />
        <Modal
          isOpen={showErrorModal}
          contentLabel="Error Message"
          closeTimeoutMS={200}
          className="ReactModalDefault"
          overlayClassName="ReactModalOverlay"
        >
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                onClick={this.closeModalClick('showConfirmModal')}
              >
                <span aria-hidden="true">x</span>
              </button>
              <div className="modal-title">Uh oh, an error has occured</div>
            </div>
            <div className="modal-body">
              <div>{errorMessage}</div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.closeModalClick('showErrorModal')}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={showConfirmModal}
          contentLabel="Confirm"
          closeTimeoutMS={200}
          className="ReactModalDefault"
          overlayClassName="ReactModalOverlay"
        >
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                onClick={this.closeModalClick('showConfirmModal')}
              >
                <span aria-hidden="true">x</span>
              </button>
              <div className="modal-title">Please Confirm</div>
            </div>
            <div className="modal-body">
              <div>Warning: {confirmMessage}</div>
              <br />
              <div>Are you sure you want to continue?</div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={this.closeModalClick('showConfirmModal')}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => this.onSaveAsYamlWithOverride()}
              >
                Continue
              </button>
            </div>
          </div>
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
