import React, { Component } from 'react';
import PropTypes from 'prop-types';

import noop from '../../../utils/common-noop';
import ModalInputWrapper from './ModalInputWrapper';
import ImportUrl from './ImportUrl';
import ModalConfirmWrapper from './ModalConfirmWrapper';
import ModalErrorWrapper from './ModalErrorWrapper';

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
      languageFormat: 'yaml',
    };
  }

  componentDidMount() {
    this.getLanguageFormat();
  }

  componentDidUpdate() {
    this.shouldUpdateLanguageFormat();
  }

  getLanguageFormat = async () => {
    const { topbarActions } = this.props;
    const result = await topbarActions.getDefinitionLanguageFormat();
    if (result.languageFormat) {
      this.setState({
        languageFormat: result.languageFormat,
      });
    }
  };

  shouldUpdateLanguageFormat = async () => {
    const { topbarActions } = this.props;
    const { languageFormat } = this.state;
    const result = await topbarActions.shouldUpdateDefinitionLanguageFormat({
      languageFormat,
    });
    // expect result.shouldUpdate to be boolean
    if (result.shouldUpdate && result.languageFormat !== languageFormat) {
      this.setState({
        languageFormat: result.languageFormat,
      });
    }
  };

  handleCloseModalClick = (showModalProperty) => () => {
    this.setState({ [showModalProperty]: false });
  };

  handleImportUrlClick = async () => {
    this.setState({
      showImportUrlModal: true,
      importUrlString: '',
    });
  };

  handleImportUrlChange = (e) => {
    this.setState({
      importUrlString: e.target.value,
    });
  };

  handleSubmitImportUrl = async () => {
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
      // display the error message
      this.setState({
        showErrorModal: true,
        errorMessage: importedData.error,
      });
    }
  };

  handleSaveAsJsonClick = async () => {
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

  handleSaveAsJsonResolvedClick = async () => {
    const { topbarActions } = this.props;
    const saveResult = await topbarActions.saveAsJsonResolved();
    if (saveResult && saveResult.error) {
      // display the error message
      this.setState({
        showErrorModal: true,
        errorMessage: saveResult.error,
      });
    }
  };

  handleSaveAsYamlResolvedClick = async () => {
    const { topbarActions } = this.props;
    const saveResult = await topbarActions.saveAsYamlResolved();
    if (saveResult && saveResult.error) {
      // display the error message
      this.setState({
        showErrorModal: true,
        errorMessage: saveResult.error,
      });
    }
  };

  handleSaveAsYamlClick = async () => {
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

  handleSaveAsYamlWithOverride = async () => {
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
    const SaveAsJsonOrYaml = getComponent('SaveAsJsonOrYaml');

    const {
      showImportUrlModal,
      showErrorModal,
      errorMessage,
      showConfirmModal,
      confirmMessage,
      languageFormat,
    } = this.state;

    return (
      <div>
        <ModalInputWrapper
          isOpen={showImportUrlModal}
          contentLabel="Import URL"
          modalTitle="Import URL"
          onCloseModalClick={this.handleCloseModalClick('showImportUrlModal')}
          onCancelModalClick={this.handleCloseModalClick('showImportUrlModal')}
          onSubmitModalClick={() => this.handleSubmitImportUrl()}
          modalBodyContent={<ImportUrl onImportUrlChange={this.handleImportUrlChange} />}
        />
        <ModalConfirmWrapper
          isOpen={showConfirmModal}
          contentLabel="Confirm"
          modalTitle="Please Confirm"
          onCloseModalClick={this.handleCloseModalClick('showConfirmModal')}
          onCancelModalClick={this.handleCloseModalClick('showConfirmModal')}
          onSubmitModalClick={() => this.handleSaveAsYamlWithOverride()}
          modalBodyContent={confirmMessage}
        />
        <ModalErrorWrapper
          isOpen={showErrorModal}
          contentLabel="Error Message"
          modalTitle="Uh oh, an error has occured"
          onCloseModalClick={this.handleCloseModalClick('showErrorModal')}
          onCancelModalClick={this.handleCloseModalClick('showErrorModal')}
          onSubmitModalClick={() => noop}
          modalBodyContent={errorMessage}
        />

        <DropdownMenu displayName="File">
          <DropdownItem onClick={() => this.handleImportUrlClick()} name="Import URL" />
          <ImportFileDropdownItem getComponent={getComponent} topbarActions={topbarActions} />
          <li role="separator" />
          <SaveAsJsonOrYaml
            getComponent={getComponent}
            languageFormat={languageFormat}
            onSaveAsJsonClick={this.handleSaveAsJsonClick}
            onSaveAsYamlClick={this.handleSaveAsYamlClick}
          />
          <li role="separator" />
          <DropdownItem
            onClick={() => this.handleSaveAsJsonResolvedClick()}
            name="Download Resolved JSON"
          />
          <DropdownItem
            onClick={() => this.handleSaveAsYamlResolvedClick()}
            name="Download Resolved YAML"
          />
        </DropdownMenu>
      </div>
    );
  }
}

FileMenuDropdown.propTypes = {
  getComponent: PropTypes.func.isRequired,
  topbarActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
