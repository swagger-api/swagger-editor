import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useLanguageFormat } from './shared-hooks';
import noop from '../../../utils/common-noop';
import ImportUrl from './ImportUrl';
import ModalInputWrapper from './ModalInputWrapper';
import ModalConfirmWrapper from './ModalConfirmWrapper';
import ModalErrorWrapper from './ModalErrorWrapper';

export default function FileMenuDropdownHooks(props) {
  const { getComponent, topbarActions } = props;
  const languageFormat = useLanguageFormat(topbarActions);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  const handleSaveAsJsonClick = () => {
    async function saveAsJson() {
      // const saveResult = await topbarActions.saveAsJsonResolved();
      const saveResult = await topbarActions.saveAsJson();
      if (saveResult && saveResult.error) {
        // set & display the error message
        setErrorMessage(saveResult.error); // original non-resolved
        setShowErrorModal(true);
      }
    }
    // call the async/await function
    saveAsJson();
  };

  const handleSaveAsYamlClick = () => {
    async function saveAsYaml() {
      // const saveResult = await topbarActions.saveAsYamlResolved({ overrideWarning: false });
      const saveResult = await topbarActions.saveAsYaml({ overrideWarning: false });
      if (saveResult && saveResult.warning) {
        setShowConfirmModal(true);
        setConfirmMessage(saveResult.warning);
      }
      if (saveResult && saveResult.error) {
        // set & display the error message
        if (saveResult.payload.message) {
          // we can get this error message if we forgot the 'overrideWarning" option above
          setErrorMessage(saveResult.payload.message);
        } else if (saveResult.error) {
          setErrorMessage(saveResult.error);
        }
        setShowErrorModal(true);
      }
    }
    // call the async/await function
    saveAsYaml();
  };

  const handleSaveAsYamlWithOverride = () => {
    async function saveAsYaml() {
      // const saveResult = await topbarActions.saveAsYamlResolved({ overrideWarning: false });
      const saveResult = await topbarActions.saveAsYaml({ overrideWarning: true });
      if (saveResult && saveResult.error) {
        // set & display the error message
        if (saveResult.payload.message) {
          // we can get this error message if we forgot the 'overrideWarning" option above
          setErrorMessage(saveResult.payload.message);
        } else if (saveResult.error) {
          setErrorMessage(saveResult.error);
        }
        setShowErrorModal(true);
      }
      setShowConfirmModal(false);
      setConfirmMessage('');
    }
    // call the async/await function
    saveAsYaml();
  };

  const handleSaveAsJsonResolvedClick = () => {
    // Todo: add a test? or is this dev-only?
    async function saveAsJson() {
      const saveResult = await topbarActions.saveAsJsonResolved();
      // const saveResult = await topbarActions.saveAsJson();
      if (saveResult && saveResult.error) {
        // set & display the error message
        setErrorMessage(saveResult.error); // original non-resolved
        setShowErrorModal(true);
      }
    }
    // call the async/await function
    saveAsJson();
  };

  const handleSaveAsYamlResolvedClick = () => {
    // Todo: add a test? or is this dev-only?
    async function saveAsYaml() {
      const saveResult = await topbarActions.saveAsYamlResolved({ overrideWarning: false });
      // const saveResult = await topbarActions.saveAsYaml({ overrideWarning: false });
      if (saveResult && saveResult.warning) {
        setShowConfirmModal(true);
        setConfirmMessage(saveResult.warning);
      }
      if (saveResult && saveResult.error) {
        // set & display the error message
        if (saveResult.payload.message) {
          // we can get this error message if we forgot the 'overrideWarning" option above
          setErrorMessage(saveResult.payload.message);
        } else if (saveResult.error) {
          setErrorMessage(saveResult.error);
        }
        setShowErrorModal(true);
      }
    }
    // call the async/await function
    saveAsYaml();
  };

  const [showImportUrlModal, setShowImportUrlModal] = useState(false);
  const [importUrlString, setImportUrlString] = useState('');

  const handleImportUrlClick = () => {
    setImportUrlString('');
    setShowImportUrlModal(true);
  };

  const handleImportUrlChange = (e) => {
    setImportUrlString(e.target.value);
  };

  const handleImportFromURL = () => {
    // dev note for copy/paste testing https://petstore.swagger.io/v2/swagger.json
    // another url: https://petstore3.swagger.io/api/v3/openapi.json
    async function importFromURL({ url }) {
      const importedData = await topbarActions.importFromURL({ url });
      if (importedData && importedData.error) {
        // set & display error message
        setErrorMessage(importedData.error);
        setShowErrorModal(true);
      }
    }
    // call the async/await function
    importFromURL({ url: importUrlString });
  };

  const handleSubmitImportUrl = () => {
    // todo refactor: we should send importUrlString through a safety check
    if (importUrlString) {
      handleImportFromURL(importUrlString);
    }
    setShowImportUrlModal(false);
  };

  const handleCloseModalClick = (showModalProperty) => () => {
    if (showModalProperty === 'showErrorModal') {
      setShowErrorModal(false);
    }
    if (showModalProperty === 'showConfirmModal') {
      setShowConfirmModal(false);
    }
    if (showModalProperty === 'showImportUrlModal') {
      setShowImportUrlModal(false);
    }
  };

  const DropdownMenu = getComponent('DropdownMenu');
  const DropdownItem = getComponent('DropdownItem');
  const ImportFileDropdownItem = getComponent('ImportFileDropdownItem');
  const SaveAsJsonOrYaml = getComponent('SaveAsJsonOrYaml');

  return (
    <div>
      <ModalErrorWrapper
        isOpen={showErrorModal}
        contentLabel="Error Message"
        modalTitle="Uh oh, an error has occured"
        onCloseModalClick={handleCloseModalClick('showErrorModal')}
        onCancelModalClick={handleCloseModalClick('showErrorModal')}
        onSubmitModalClick={() => noop}
        modalBodyContent={errorMessage}
      />
      <ModalConfirmWrapper
        isOpen={showConfirmModal}
        contentLabel="Confirm"
        modalTitle="Please Confirm"
        onCloseModalClick={handleCloseModalClick('showConfirmModal')}
        onCancelModalClick={handleCloseModalClick('showConfirmModal')}
        onSubmitModalClick={() => handleSaveAsYamlWithOverride()}
        modalBodyContent={confirmMessage}
      />
      <ModalInputWrapper
        isOpen={showImportUrlModal}
        contentLabel="Import URL"
        modalTitle="Import URL"
        onCloseModalClick={handleCloseModalClick('showImportUrlModal')}
        onCancelModalClick={handleCloseModalClick('showImportUrlModal')}
        onSubmitModalClick={() => handleSubmitImportUrl()}
        modalBodyContent={<ImportUrl onImportUrlChange={handleImportUrlChange} />}
      />
      <DropdownMenu displayName="Main">
        <DropdownItem onClick={() => handleImportUrlClick()} name="Import URL" />
        <ImportFileDropdownItem getComponent={getComponent} topbarActions={topbarActions} />
        <li role="separator" />
        <SaveAsJsonOrYaml
          getComponent={getComponent}
          languageFormat={languageFormat}
          onSaveAsJsonClick={handleSaveAsJsonClick}
          onSaveAsYamlClick={handleSaveAsYamlClick}
        />
        <li role="separator" />
        <DropdownItem
          onClick={() => handleSaveAsJsonResolvedClick()}
          name="Download Resolved JSON"
        />
        <DropdownItem
          onClick={() => handleSaveAsYamlResolvedClick()}
          name="Download Resolved YAML"
        />
      </DropdownMenu>
    </div>
  );
}

FileMenuDropdownHooks.propTypes = {
  getComponent: PropTypes.func.isRequired,
  topbarActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
