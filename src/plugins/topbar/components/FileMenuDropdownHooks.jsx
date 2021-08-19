// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useLanguageFormat } from './sharedHooks';
import noop from '../../../utils/utils-noop';
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

  const onSaveAsJsonClick = () => {
    async function saveAsJson() {
      // todo: see note from onSaveAsYamlClick on error of following method
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

  const onSaveAsYamlClick = () => {
    async function saveAsYaml() {
      // to reproduce, just use the oas3.0.2 default loaded definition
      // this error crashes react-dev. refer to screenshot on dereference. note the "new throw"
      // todo: the `saveAsYamlResolved` probably needs a try/catch, to fix the following error:
      // Uncaught(in promise) DereferenceError: Error while dereferencing file "/api/v3"
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

  const onSaveAsYamlWithOverride = () => {
    async function saveAsYaml() {
      // todo: see note from onSaveAsYamlClick on error of following method
      // const saveResult = await topbarActions.saveAsYamlResolved({ overrideWarning: false });
      const saveResult = await topbarActions.saveAsYaml({ overrideWarning: true });
      if (saveResult && saveResult.error) {
        // console.log('saveResult', saveResult);
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

  const [showImportUrlModal, setShowImportUrlModal] = useState(false);
  const [importUrlString, setImportUrlString] = useState('');

  const onImportUrlClick = () => {
    // ref legacy method: importFromURL
    setImportUrlString('');
    setShowImportUrlModal(true);
  };
  const onImportUrlChange = (e) => {
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

  const onSubmitImportUrl = () => {
    // todo refactor: we should send importUrlString through a safety check
    if (importUrlString) {
      handleImportFromURL(importUrlString);
    }
    setShowImportUrlModal(false);
  };

  const closeModalClick = (showModalProperty) => () => {
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
        closeModalClick={closeModalClick('showErrorModal')}
        cancelModalClick={closeModalClick('showErrorModal')}
        submitModalClick={() => noop}
        modalBodyContent={errorMessage}
      />
      <ModalConfirmWrapper
        isOpen={showConfirmModal}
        contentLabel="Confirm"
        modalTitle="Please Confirm"
        closeModalClick={closeModalClick('showConfirmModal')}
        cancelModalClick={closeModalClick('showConfirmModal')}
        submitModalClick={() => onSaveAsYamlWithOverride()}
        modalBodyContent={confirmMessage}
      />
      <ModalInputWrapper
        isOpen={showImportUrlModal}
        contentLabel="Import URL"
        modalTitle="Import URL"
        closeModalClick={closeModalClick('showImportUrlModal')}
        cancelModalClick={closeModalClick('showImportUrlModal')}
        submitModalClick={() => onSubmitImportUrl()}
        modalBodyContent={<ImportUrl onImportUrlChange={onImportUrlChange} />}
      />
      <DropdownMenu displayName="Main">
        <DropdownItem onClick={() => onImportUrlClick()} name="Import URL" />
        <ImportFileDropdownItem getComponent={getComponent} topbarActions={topbarActions} />
        <li role="separator" />
        <SaveAsJsonOrYaml
          getComponent={getComponent}
          languageFormat={languageFormat}
          onSaveAsJsonClick={onSaveAsJsonClick}
          onSaveAsYamlClick={onSaveAsYamlClick}
        />
      </DropdownMenu>
    </div>
  );
}

FileMenuDropdownHooks.propTypes = {
  getComponent: PropTypes.func.isRequired,
  topbarActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
